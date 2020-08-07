import { BaseComponent, createElement, Fragment, BgEvent, renderFill, getSegMeta, DateRange, DateMarker, buildEventRangeKey } from '@fullcalendar/common'
import { TimelineCoords } from './TimelineCoords'
import { TimelineLaneSeg } from './TimelineLaneSlicer'


export interface TimelineLaneBgProps {
  businessHourSegs: TimelineLaneSeg[] | null // can be null :(
  bgEventSegs: TimelineLaneSeg[] | null // can be null :(
  dateSelectionSegs: TimelineLaneSeg[]
  eventResizeSegs: TimelineLaneSeg[]
  timelineCoords?: TimelineCoords
  todayRange: DateRange
  nowDate: DateMarker
}


export class TimelineLaneBg extends BaseComponent<TimelineLaneBgProps> {


  render() {
    let { props } = this
    let highlightSeg = [].concat(props.eventResizeSegs, props.dateSelectionSegs)

    return props.timelineCoords && (
      <div className='fc-timeline-bg'>
        {/* Fragments contain the keys */}
        {this.renderSegs(props.businessHourSegs || [], props.timelineCoords, 'non-business')}
        {this.renderSegs(props.bgEventSegs || [], props.timelineCoords, 'bg-event')}
        {this.renderSegs(highlightSeg, props.timelineCoords, 'highlight')}
      </div>
    )
  }


  renderSegs(segs: TimelineLaneSeg[], timelineCoords: TimelineCoords, fillType: string) {
    let { todayRange, nowDate } = this.props

    let children = segs.map((seg) => {
      let coords = timelineCoords.rangeToCoords(seg) // seg has { start, end }

      return (
        <div key={buildEventRangeKey(seg.eventRange)} className='fc-timeline-bg-harness' style={{
          left: coords.left,
          right: -coords.right // outwards from right edge (which is same as left edge)
        }}>
          {fillType === 'bg-event' ?
            <BgEvent seg={seg} {...getSegMeta(seg, todayRange, nowDate)} /> :
            renderFill(fillType)
          }
        </div>
      )
    })

    return <Fragment>{children}</Fragment>
  }

}
