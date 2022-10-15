const root = 0;
myNodeArray = [{ key: root, text: ' ', color: 'lightgrey' }];
myLinkArray = [];

function add() {
    resetAll();

    let name = document.getElementById("inputField").value;
    name = name.toUpperCase();

    if (!isAlphaAndNotEmpty(name)) return false;

    let letters = [...name];
    let nodes = [];
    let links = [];
    let fromLink = root;

    for (let i = 0; i < letters.length; ++i) {
        let newKey = name.slice(0, i + 1)

        if (myDiagram.model.findNodeDataForKey(newKey) === null) {
            if (i === letters.length - 1) {
                nodes.push({ key: newKey, text: letters[i], end: 1 });
            } else {
                nodes.push({ key: newKey, text: letters[i], end: 0 });
            }
            links.push({ from: fromLink, to: newKey });
        } else {
            if (i === letters.length - 1)
                myDiagram.model.set(myDiagram.model.findNodeDataForKey(newKey), "end", 1);
        }
        fromLink = newKey;
    }
    myDiagram.model.addNodeDataCollection(nodes);
    myDiagram.model.addLinkDataCollection(links);

    resetColors();
    ROOT.put(name);
}

function remove() {
    resetAll();

    let name = document.getElementById("inputField").value;
    name = name.toUpperCase();

    let nodesBin = [];
    let linksBin = [];

    let nodeToRemove = myDiagram.findNodeForKey(name);

    if (nodeToRemove === null || nodeToRemove.data.end !== 1) {
        console.log('NO SUCH WORD IN TREE');

    } else {
        if (nodeToRemove.isTreeLeaf === false) {
            myDiagram.model.set(nodeToRemove.data, "end", 0);

        } else {
            let root = myDiagram.findNodeForKey(0);

            nodesBin.push(nodeToRemove.data);
            linksBin.push(nodeToRemove.findTreeParentLink().data)

            while (true) {
                let currentNode = nodeToRemove.findTreeParentNode();
                if (currentNode === root) break;
                let linkUp = currentNode.findTreeParentLink();

                nodeToRemove = currentNode;

                let childCount = currentNode.findTreeChildrenNodes().count;

                if (childCount < 2 && currentNode.data.end === 0) {
                    nodesBin.push(currentNode.data);
                    linksBin.push(linkUp.data);
                } else
                    break;
            }
            myDiagram.model.removeNodeDataCollection(nodesBin);
            myDiagram.model.removeLinkDataCollection(linksBin);
        }
    }

    resetColors();
    ROOT.remove(name);
}

function findName() {
    resetAll();

    let name = document.getElementById("inputField").value;
    name = name.toUpperCase();

    if (!isAlphaAndNotEmpty(name)) {
        printAll('no results');
        return false
    };

    let node = myDiagram.findNodeForKey(name);
    if (node === null || node.data.end === 0) {
        printAll('no results');
        return false;
    }

    while (node !== root) {
        myDiagram.model.set(node.data, 'color', 'orange');
        node = node.findTreeParentNode();
        if (node.key === root) {
            break;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////
const $ = go.GraphObject.make;
const myDiagram = new go.Diagram("myDiagramDiv",
    {
        layout: new go.TreeLayout({ angle: 90, layerSpacing: 20 })
    });

myDiagram.nodeTemplate =
    $(go.Node, "Auto",
        { deletable: false },
        new go.Binding("text", "text"),
        $(go.Shape, "RoundedRectangle",
            {
                fill: "lightblue",
                stroke: null, strokeWidth: 0,
                stretch: go.GraphObject.Fill,
                alignment: go.Spot.Center
            },
            new go.Binding("fill", "color")),
        $(go.TextBlock,
            {
                font: "700 16px sans-serif",
                textAlign: "center",
                margin: 9, maxSize: new go.Size(70, NaN)
            },
            new go.Binding("text", "text"))
    );

myDiagram.linkTemplate =
    new go.Link(
        { routing: go.Link.Orthogonal, corner: 5 })
        .add(new go.Shape({ strokeWidth: 2, stroke: "#555" }))
        .add(new go.Shape({ toArrow: "Standard", stroke: null }))

myDiagram.model = new go.GraphLinksModel(myNodeArray, myLinkArray);
myDiagram.isReadOnly = true;
////////////////////////////////////////////////////////////////////////////////////

class Node {
    constructor(end = false) {
        this.end = end;
        this.children = Array(26).fill(null);
    }

    put(name) {
        name = name.toUpperCase();
        let current = this;

        for (let i = 0; i < name.length; ++i) {

            if (current.children[name.charCodeAt(i) - 65] === null) {
                current.children[name.charCodeAt(i) - 65] = new Node();
            }
            current = current.children[name.charCodeAt(i) - 65];
        }
        current.end = true;
    }

    remove(name) {
        return this.myRemove(name, 0);
    }

    myRemove(name, depth) {
        name = name.toUpperCase();
        if (depth === name.length) {
            if (this.end === false)
                return false;
            else {
                this.end = false;
                return true;
            }
        }
        let childIndex = name.charCodeAt(depth) - 65;

        if (this.children[childIndex] !== null) {
            this.children[childIndex].myRemove(name, depth + 1);
            if (this.children[childIndex].size() === 0)
                this.children[childIndex] = null;
            return true;
        }
        else
            return false;
    }

    size() {
        let currentSize = 0;

        if (this.end === true) {
            currentSize++;
        }
        for (let i = 0; i < 26; ++i) {
            if (this.children[i] !== null)
                currentSize += this.children[i].size();
        }
        return currentSize;
    }

    getAllWithPrefix(prefix) {
        let list = [];
        return this.myGetAllWithPrefix(prefix, list, 0);
    }

    myGetAllWithPrefix(prefix, list, depth) {
        if (depth < prefix.length) {
            let childIndex = prefix.charCodeAt(depth) - 65;
            if (this.children[childIndex] !== null) {
                this.children[childIndex].myGetAllWithPrefix(prefix, list, depth + 1);
            }
        }
        if (depth === prefix.length)
            return this.myGetAll(prefix, list);

        return list;
    }

    myGetAll(currentName, list) {
        if (this.end === true)
            list.push(currentName);
        for (let i = 0; i < 26; ++i) {
            if (this.children[i] !== null) {
                currentName = currentName + String.fromCharCode(i + 65);
                this.children[i].myGetAll(currentName, list);
                currentName = currentName.slice(0, -1);
            }
        }
        return list;
    }

    getAll() {
        let currentName = "";
        let list = [];
        return this.myGetAll(currentName, list);
    }

    myGetAllMatching(pattern, currentName, list, depth) {
        if (pattern.length === depth && this.end === true) {
            list.push(currentName);
        }
        if (pattern.length > depth && pattern.charAt(depth) === '*') {
            for (let i = 0; i < 26; ++i) {
                if (this.children[i] !== null) {
                    currentName = currentName + String.fromCharCode(i + 65);
                    this.children[i].myGetAllMatching(pattern, currentName, list, depth + 1);
                    currentName = currentName.slice(0, -1);
                }
            }
        } else if (pattern.length > depth && this.children[pattern.charCodeAt(depth) - 65] !== null) {
            currentName = currentName + pattern.charAt(depth);
            this.children[pattern.charCodeAt(depth) - 65].myGetAllMatching(pattern, currentName, list, depth + 1);
            currentName = currentName.slice(0, -1);
        }
        return list;
    }

    getAllMatching(pattern) {
        let name = '';
        let list = [];
        return this.myGetAllMatching(pattern, name, list, 0);
    }

}

let ROOT = new Node();

function printAll(s) {
    let items;
    document.getElementById('myItemList').innerHTML = "";

    let text = document.getElementById("inputField").value;
    text = text.toUpperCase();

    if ((s === 'prefix' && !isAlphaAndNotEmpty(text)) || (s === 'matching' && !isAlphaOr42AndNotEmpty(text)))
        s = 'no results';

    switch (s) {
        case 'matching': {
            items = ROOT.getAllMatching(text);
            break;
        }
        case 'prefix': {
            items = ROOT.getAllWithPrefix(text);
            break;
        }
        case 'all': {
            items = ROOT.getAll();
            break;
        }
        case 'no results': {
            items = ['No results'];
        }
    }
    if (items.length === 0)
        items = ['No results'];


    let ul = document.createElement('ul');
    document.getElementById('myItemList').appendChild(ul);

    items.forEach(item => {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
    });

    resetColors();
}

function isAlphaAndNotEmpty(word) {
    if (word.length < 1)
        return false;
    for (let i = 0; i < word.length; ++i) {
        if (word.charCodeAt(i) < 65 || word.charCodeAt(i) > 90)
            return false;
    }
    return true;
}

function isAlphaOr42AndNotEmpty(word) {
    if (word.length < 1)
        return false;
    for (let i = 0; i < word.length; ++i) {
        if (word.charCodeAt(i) !== 42 && (word.charCodeAt(i) < 65 || word.charCodeAt(i) > 90))
            return false;
    }
    return true;
}

function resetAll() {
    document.getElementById('myItemList').innerHTML = "";
    resetColors();
}

function resetColors() {
    myDiagram.model.nodeDataArray.forEach(element => {
        if (element.end === 1)
            myDiagram.model.set(element, 'color', 'lightSkyBlue');
        else
            myDiagram.model.set(element, 'color', 'PowderBlue');

        if (element.key === root)
            myDiagram.model.set(element, 'color', 'lightgrey');

    });
}






