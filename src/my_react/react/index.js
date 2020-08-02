
import { createDOM } from "../react-dom";

/**
 * 功能：
 * - 创建虚拟DOM元素？（用于收集虚拟DOM元素的所有属性）
 * - 
 * 
 *
 * 
 * @param {*} type
 * @param {*} config
 * @param  {...any} children
 */
function createElement(type, config, ...children) {

	let props = {
		...config,
		children
	}
	let element = { type, props };
	return element;
}
class Component {
	static isReactComponent = true;
	constructor(props) {
		this.props = props;
		this.updateQueue = [];
		this.isBatchingUpdate = false;
	}

  /**
   * 1. 批量更新模式（同步）
   * @param partialState
   */
	setState(partialState) {
		this.updateQueue.push(partialState);
		if (!this.isBatchingUpdate) {
		} else {
			this.flushUpdateQueue();
		}
	}

  /**
   * 刷新所有缓存的partialState
   */
	flushUpdateQueue = () => {
		// this.updateQueue.reduce((memo,cur) => {
		//   if(typeof cur === 'function') {
		//     memo = {...memo,...cur(memo)};
		//   }else {
		//   //  数组和对象的情况下
		//     memo = {...memo,...cur}
		//   }
		//   return memo;
		// // 这里的state也没定义
		// },this.state)

		//这样就不需要在手动的清空数组
		while (this.updateQueue.length) {
			let item = this.updateQueue.shift();
			if (typeof item === 'function') {
				this.state = { ...this.state, ...item(this.state) };
			} else {
				//  数组和对象的情况下
				this.state = { ...this.state, ...item }
			}
			return this.state;
		}
		renderComponent(this);
	}
}

/**
 *
 * @param componentInstance
 */
function renderComponent(componentInstance) {
	// 获取新的DOM元素
	let renderElement = componentInstance.render();
	//
	let newDOM = createDOM(renderElement.type, renderElement.props, componentInstance);
	// 暴力更新, 老的DOM节点：componentInstance.dom
	componentInstance.dom.parentNode.replaceChild(newDOM, componentInstance.dom);
	// 更新老的节点为：newDOM
	componentInstance.dom = newDOM;
}

export default {
	createElement,
	Component
}
