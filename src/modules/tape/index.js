/**
 * A minimal tape-style test harness
 * @param {string} name - Test name/description
 * @param {Function} testFn - Test function that receives test object
 */
export default async function test(name, testFn) {
  const t = new Test(name);

  console.group(`🧪 ${name}`);

  try {
    // Execute the test with our test object
    await testFn(t);

    // Check if all planned assertions were run
    if (t._plannedAssertions !== null && t._assertionCount !== t._plannedAssertions) {
      console.error(`❌ Planned ${t._plannedAssertions} assertions but got ${t._assertionCount}`);
      t._failed = true;
    }

    // Report results
    if (t._failed) {
      console.error(`❌ Test "${name}" failed with ${t._failCount} failures`);
    } else {
      console.log(`✅ Test "${name}" passed (${t._assertionCount} assertions)`);
    }
  } catch (error) {
    console.error(`💥 Test "${name}" threw an exception:`, error);
    t._failed = true;
  } finally {
    console.groupEnd();
    return !t._failed;
  }
}

class Test {
  constructor(name) {
    this.name = name;
    this._assertionCount = 0;
    this._failCount = 0;
    this._failed = false;
    this._plannedAssertions = null;
    this._ended = false;
  }

  /**
   * Plan a specific number of assertions
   * @param {number} count - Expected number of assertions
   */
  plan(count) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Plan count must be a positive integer');
    }
    this._plannedAssertions = count;
    return this;
  }

  /**
   * Assert that a condition is true
   * @param {boolean} condition - Condition to test
   * @param {string} message - Description of the assertion
   */
  assert(condition, message) {
    this._assertionCount++;
    // console.log('assert: this._assertionCount', this._assertionCount)

    if (this._ended) {
      console.warn('⚠️ Assertion after end() was called');
    }

    if (!condition) {
      this._failCount++;
      this._failed = true;
      console.error(`❌ Assertion failed: ${message}`);
      // Include stack trace but skip the first line
      const stack = new Error().stack.split('\n').slice(2).join('\n');
      console.error(stack);
    } else {
      console.log(`✓ ${message}`);
    }

    return condition;
  }

  /**
   * Assert that two values are equal
   * @param {*} actual - The actual value
   * @param {*} expected - The expected value
   * @param {string} message - Description of the assertion
   */
  equal(actual, expected, message) {
    const isEqual = actual === expected;
    return this.assert(isEqual, message || `Expected ${expected}, got ${actual}`);
  }

  /**
   * Assert that two values are deep equal (for objects/arrays)
   * @param {*} actual - The actual value
   * @param {*} expected - The expected value
   * @param {string} message - Description of the assertion
   */
  deepEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    const isEqual = actualStr === expectedStr;
    return this.assert(isEqual, message || `Expected ${expectedStr}, got ${actualStr}`);
  }

  /**
   * Mark the end of a test
   */
  end() {
    this._ended = true;

    if (this._plannedAssertions !== null && this._assertionCount !== this._plannedAssertions) {
      this._failed = true;
      console.error(`❌ Planned ${this._plannedAssertions} assertions but got ${this._assertionCount}`);
    }

    return this;
  }
}
