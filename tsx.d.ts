import { VNode } from 'vue'

// 使typescript支持vue tsx
declare global {
    namespace JSX {
        interface Element extends VNode { }
        interface ElementClass extends Vue { }

        // 定义<div /> <span />等元素
        interface IntrinsicElements {
            [elemName: string]: any
        }

        // 使用$props定义属性
        interface ElementAttributesProperty {
            $props: {}
        }

        // 提供通用属性的检测
        interface IntrinsicAttributes {
            slot?: string
            ref?: string
            refInFor?: boolean
            key?: string | number
            class?: string | string[] | { [className: string]: boolean }
            style?: string | { [key: string]: string }
            vModel?: any
            children?: any
            scopedSlots?: any
            on?: any
        }

        interface ElementChildrenAttribute {
            children?: {}
        }
    }
}