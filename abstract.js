

class MapSet {
  map = new Map();
  has(id){
    return this.map.has(id);
  }
  append(id, value) {
    if (!this.map.has(id)) this.map.set(id, new Set());
    this.map.get(id).add(value);
  }
  execute(id) {
    this.map.get(id).forEach(f=>f());
    this.map.get(id).clear();
    this.map.delete(id);
  }
  executeAll(){
    this.map.forEach(set=>set.forEach(f=>f()));
    this.map.forEach(set=>set.clear());
    this.map.clear();
  }
}

function connectContainerElementToSignalElements(parentElement, signal) {
  const subscriptions = new MapSet();

  const containerElement = document.createElement("ul");
  containerElement.classList.add("dlist-unstyled", "ms-2", "content-data", 'border-primary');
  parentElement.appendChild(containerElement);

  const signalSubscriptionHandler = entries => {
    const currentElements = Object.fromEntries(entries);

    const currentIds = new Set(entries.map(([id]) => id));
    const existingIds = new Set( Array.from(containerElement.children).map((child) => child.getAttribute('name')) );
    const removeSet = existingIds.difference(currentIds);
    const addSet = currentIds.difference(existingIds);
    const removeArray = Array.from(removeSet);

    // Remove
    if(removeArray.length){
     removeArray.filter(o=>o).forEach((id) => subscriptions.execute(id) );
     removeArray.filter(o=>o).forEach((id) => containerElement.children.namedItem(id).remove());
    }

    // Add
    addSet.forEach((childId) => {
      const childContainer = document.createElement("li");
      const listEntryObject = currentElements[childId];

      if(!listEntryObject) return;

      if(listEntryObject.settings){
        const childContainerLabel = document.createElement("span");
        const unsubscribeTitle = listEntryObject.settings.signal('main', 'name').subscribe(v=>childContainerLabel.textContent = `${v} (${listEntryObject.id})`);
        subscriptions.append(childId, unsubscribeTitle);
        childContainer.appendChild(childContainerLabel);
      }
      childContainer.setAttribute('name', childId);
      containerElement.appendChild(childContainer);
      if (listEntryObject.elements) {
        const unsubscribeObject = connectContainerElementToSignalElements(childContainer, listEntryObject.elements);
        subscriptions.append(childId, unsubscribeObject);
      }
    });

    // Re-order
    if(currentIds.size > 1){
      const reorderedChildren = [...currentIds].map((id) => containerElement.children.namedItem(id));
      const disorder = [...containerElement.children].reduce( (accumulator, currentValue, index) => accumulator+(currentValue.getAttribute('name')==reorderedChildren[index].getAttribute('name')?0:1), 0);
      console.log('disorder', disorder);

      reorderedChildren.forEach((child) => containerElement.appendChild(child));
    }

  };

  const unsubscribe = signal.subscribe(signalSubscriptionHandler);
  subscriptions.append('parent', unsubscribe);
  return ()=>subscriptions.executeAll();
}

const unsubscribe = connectContainerElementToSignalElements(document.getElementById("stack-overview"), application.stack.elements);

setTimeout(()=>{  application.settings.set('author', 'name', 'zerocool'); }, 1_000)

setTimeout(()=>{ application.stack.get('main') .add('standard:basic:noop', 'aaa'); }, 2_000)
setTimeout(()=>{ application.stack.get('upperify') .add('standard:basic:noop', 'bbb'); }, 3_000)

setTimeout(()=>{ application.stack.get('main') .remove('aaa'); }, 4_000)
