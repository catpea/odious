export default class Synchronizable {
  #debounce = 10;

  // Class member descriptions
  #revision; // Tracks the version number of this value, incremented on each change
  #revisionUuid; // Unique identifier for each revision, used for conflict resolution
  #unserializedValue; // The actual value stored in its native JavaScript form
  #serializedValue; // JSON string representation of the value for comparison

  // Internal implementation details
  #debounceTimeout; // Timer reference for debounced notifications
  #listeners; // Set of callback functions to notify when value changes

  constructor(value=undefined, revision=1, revisionUuid) {
    // Validate input parameters
    if (revision !== undefined && (!Number.isInteger(revision) || isNaN(revision))) {
      throw new Error("Revision must be an integer");
    }

    if (revision !== undefined && revision < 1) {
      throw new Error("Revision must be 1 or greater (zero-indexing not supported)");
    }

    this.#revision = revision;
    this.#revisionUuid = revisionUuid || generateTimestampedUUID(); // User provided (for edge cases) or generated
    this.#unserializedValue = value; // Will be serialized/deserialized using JSON
    this.#serializedValue = JSON.stringify(value);

    // Initialize internal state
    this.#listeners = new Set();
  }

  /**
   * Register a listener function to be called when the value changes
   * @param {Function} listener - Callback function receiving (newValue, oldValue)
   * @returns {Function} Unsubscribe function to remove this listener
   */
  subscribe(listener) {
    this.#listeners.add(listener);

    // Don't initialize with undefined or null values
    let initializeListener = true;
    if(this.#unserializedValue === undefined) initializeListener = false;
    if(this.#unserializedValue === null) initializeListener = false;

    if(initializeListener) listener(this.#unserializedValue, null);
    return () => this.unsubscribe(listener); // Return unsubscribe function
  }

  /**
   * Remove a listener function from notification list
   * @param {Function} listener - The listener to remove
   */
  unsubscribe(listener) {
    this.#listeners.delete(listener);
  }

  /**
   * Notify all listeners of a value change with debouncing
   * @private
   */
  #notify(newValue, oldValue) {
    clearTimeout(this.#debounceTimeout);
    this.#debounceTimeout = setTimeout(() => {
      this.#listeners.forEach(listener => listener(newValue, oldValue, this.#revision, this.#revisionUuid));
    }, this.#debounce);
  }

  /**
   * Set a new value, incrementing the revision and notifying listeners
   */
  set value(newUnserializedValue) {
    const oldSerializedValue = this.#serializedValue;
    const newSerializedValue = JSON.stringify(newUnserializedValue);

    // Compare serialized values to handle edge cases
    // WARN/TODO: serializer should sort keys to ensure comparison is stable
    const isUnchanged = oldSerializedValue === newSerializedValue;
    if(isUnchanged) return; // Early exit if no change

    // Increment revision and generate new UUID
    this.#revision = this.#revision + 1;
    this.#revisionUuid = generateTimestampedUUID();

    // Update stored values
    this.#unserializedValue = newUnserializedValue;
    this.#serializedValue = newSerializedValue;

    // Notify subscribers with new and old values
    const oldUnserializedValue = this.#unserializedValue;
    this.#notify(newUnserializedValue, oldUnserializedValue);

    /*
      NOTE: Server synchronization is handled externally
      The user can implement this by subscribing to changes
      and propagating them to their synchronization system
    */
  }

  /**
   * Get the current value
   * @returns {*} The current unserialized value
   */
  get value() {
    return this.#unserializedValue;
  }

  /**
   * Apply a remote update with conflict resolution
   * @param {number} remoteRevision - The revision number from the remote source
   * @param {string} remoteRevisionId - The UUID of the remote revision
   * @param {*} newUnserializedRemoteValue - The new value from the remote source
   */
  remote(remoteRevision, remoteRevisionId, newUnserializedRemoteValue) {
    // Validate input parameters
    if (!Number.isInteger(remoteRevision) || isNaN(remoteRevision)) {
      throw new Error("Remote revision must be an integer");
    }

    if (remoteRevision < 1) {
      throw new Error("Remote revision must be 1 or greater");
    }

    if (!remoteRevisionId || typeof remoteRevisionId !== 'string') {
      throw new Error("Remote revision ID must be a non-empty string");
    }

    // Determine the type of update
    const isUpdate = remoteRevision > this.#revision;
    const isDuplicate = (remoteRevision === this.#revision) && (remoteRevisionId === this.#revisionUuid);
    const isConflict = remoteRevision === this.#revision && !isDuplicate;

    if (isUpdate) {
      // Simple case: remote revision is newer
      const oldSerializedValue = this.#serializedValue;
      const newSerializedValue = JSON.stringify(newUnserializedRemoteValue);
      const isChanged = oldSerializedValue !== newSerializedValue;

      this.#revision = remoteRevision;
      this.#revisionUuid = remoteRevisionId;

      if (isChanged) {
        // Only notify if actual value has changed
        this.#unserializedValue = newUnserializedRemoteValue;
        this.#serializedValue = newSerializedValue;
        const oldUnserializedValue = this.#unserializedValue;
        this.#notify(newUnserializedRemoteValue, oldUnserializedValue);
      }
    } else if (isConflict) {
      // Conflict case: same revision, different UUIDs
      // Winner determined by comparing UUIDs alphanumerically
      const isWinner = remoteRevisionId > this.#revisionUuid;

      if (isWinner) {
        // Take on remote revision and revision id
        this.#revision = remoteRevision;
        this.#revisionUuid = remoteRevisionId;

        // Update to remote value
        const newSerializedValue = JSON.stringify(newUnserializedRemoteValue);
        const oldSerializedValue = this.#serializedValue;
        const isChanged = oldSerializedValue !== newSerializedValue;

        this.#unserializedValue = newUnserializedRemoteValue;
        this.#serializedValue = newSerializedValue;

        if (isChanged) {
          const oldUnserializedValue = this.#unserializedValue;
          this.#notify(newUnserializedRemoteValue, oldUnserializedValue);
        }
      }
    } else if (isDuplicate) {
      // Duplicate case: we already have this exact revision
      // Do nothing, assuming an "at least once" delivery scenario
    }
  }

  /**
   * Get the current debounce timeout in milliseconds
   * @returns {number} Debounce timeout in milliseconds
   */
  get debounce() {
    return this.#debounce;
  }

  /**
   * Set the debounce timeout for notifications
   * @param {number} ms - Debounce timeout in milliseconds
   */
  set debounce(ms) {
    if (!Number.isInteger(ms) || ms < 0) {
      throw new Error("Debounce timeout must be a non-negative integer");
    }
    this.#debounce = ms;
  }

  /**
   * Get the current revision number (read-only)
   * @returns {number} Current revision number
   */
  get revision() {
    return this.#revision;
  }

  /**
   * Get the current revision UUID (read-only)
   * @returns {string} Current revision UUID
   */
  get revisionUuid() {
    return this.#revisionUuid;
  }
}

/**
 * Generate a unique identifier combining timestamp and random values
 * @returns {string} A unique identifier string
 */
function generateTimestampedUUID() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
}
