/**
 * - 根据虚拟DOM创建真实DOM元素
 * 
 * - 向目标节点挂载DOM
 * 
 * @param {*} element
 * @param {*} parentNode
 * @param {*} componentInstance
 */
function render(element, parentNode, componentInstance) {
	// 防止文本节点
	if (typeof element === "string" || typeof element === "number") {
		return parentNode.appendChild(document.createTextNode(element));
	}
	let type = element.type,
		props = element.props;
	// 兼容处理类组件和函数组件
	let isReactComponent = type.isReactComponent;
	if (isReactComponent) {
		// TODO: 这里不懂
		componentInstance = new type(props);
		element = componentInstance.render();
		type = element.type;
		props = element.props;
	} else if (typeof type === "function") {
		element = type(props);
		type = element.type;
		props = element.props;
	}
	let reallyDOM = createDOM(type, props, componentInstance);
	if (isReactComponent) componentInstance.dom = reallyDOM;
	parentNode.appendChild(reallyDOM);
}
/**
 * 
 *
 * @param {*} type
 * @param {*} props
 * @param {*} componentInstance
 */
export function createDOM(type, props, componentInstance) {
	let currentDOM = document.createElement(type);
	for (let propName in props) {
		if (propName === 'children') {
			// 开始递归创建子节点
			let childrenNode = props.children;
			// console.log(childrenNode);
			childrenNode.forEach((child) => { render(child, currentDOM, componentInstance) })
		} else if (propName === "style") {
			let styleObject = props.style;
			for (let styleAttr in styleObject) {
				currentDOM.style[styleAttr] = styleObject[styleAttr];
			}
		} else if (propName === "className") {
			currentDOM.className = props.className;
		} else if (propName.startsWith('on')) {
			// TODO: 事件处理
		} else {
			// 认为是自定义属性字段
			currentDOM.setAttribute(propName, props[propName])
		}
	}
	return currentDOM;
}
export default {
	render
}
