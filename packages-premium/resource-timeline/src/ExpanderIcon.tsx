import { createElement, VNode, Fragment } from '@fullcalendar/common'


/*
Renders the DOM responsible for the subrow expander area,
as well as the space before it (used to align expanders of similar depths)
*/
export function ExpanderIcon({ depth, hasChildren, isExpanded, onExpanderClick }) {
  let nodes: VNode[] = []

  for (let i = 0; i < depth; i++) {
    nodes.push(
      <span className='fc-icon'></span>
    )
  }

  let iconClassNames = [ 'fc-icon' ]
  if (hasChildren) {
    if (isExpanded) {
      iconClassNames.push('fc-icon-minus-square')
    } else {
      iconClassNames.push('fc-icon-plus-square')
    }
  }

  nodes.push(
    <span
      className={'fc-datagrid-expander' + (hasChildren ? '' : ' fc-datagrid-expander-placeholder')}
      onClick={onExpanderClick}
    >
      <span className={iconClassNames.join(' ')}></span>
    </span>
  )

  return createElement(Fragment, {}, ...nodes)
}
