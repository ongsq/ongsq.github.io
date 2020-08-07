import { ResourceTimelineViewWrapper } from '../lib/wrappers/ResourceTimelineViewWrapper'
import { waitEventDrag } from 'fullcalendar-tests/lib/wrappers/interaction-util'

describe('eventConstraint', function() {
  pushOptions({
    now: '2016-09-04',
    initialView: 'resourceTimelineWeek',
    scrollTime: '00:00',
    editable: true,
    resources: [
      { id: 'a', title: 'Resource A' },
      { id: 'b', title: 'Resource B' },
      { id: 'c', title: 'Resource C' }
    ],
    events: [
      {
        title: 'event 1',
        start: '2016-09-04T01:00',
        resourceId: 'b'
      }
    ]
  })

  // FYI: the fact that eventConstraint may be specified in Event Source and Event Objects
  // is covered by the core tests.

  describe('with one resourceId', function() {
    pushOptions({
      eventConstraint: {
        resourceId: 'b'
      }
    })

    it('allows dragging to the resource', function(done) {
      let calendar = initCalendar()
      let timelineGridWrapper = new ResourceTimelineViewWrapper(calendar).timelineGrid
      let dragging = timelineGridWrapper.dragEventTo(
        timelineGridWrapper.getFirstEventEl(), 'b', '2016-09-04T03:00:00'
      )

      waitEventDrag(calendar, dragging).then((modifiedEvent) => {
        expect(modifiedEvent.start).toEqualDate('2016-09-04T03:00:00Z')
        done()
      })
    })

    it('disallows dragging to other resources', function(done) {
      let calendar = initCalendar()
      let timelineGridWrapper = new ResourceTimelineViewWrapper(calendar).timelineGrid
      let dragging = timelineGridWrapper.dragEventTo(
        timelineGridWrapper.getFirstEventEl(), 'c', '2016-09-04T03:00:00'
      )

      waitEventDrag(calendar, dragging).then((modifiedEvent) => {
        expect(modifiedEvent).toBeFalsy() // failure
        done()
      })
    })
  })

  describe('with multiple resourceIds', function() {
    pushOptions({
      eventConstraint: {
        resourceIds: [ 'b', 'c' ]
      }
    })

    it('allows dragging to whitelisted resource', function(done) {
      let calendar = initCalendar()
      let timelineGridWrapper = new ResourceTimelineViewWrapper(calendar).timelineGrid
      let dragging = timelineGridWrapper.dragEventTo(
        timelineGridWrapper.getFirstEventEl(), 'c', '2016-09-04T03:00:00'
      )

      waitEventDrag(calendar, dragging).then((modifiedEvent) => {
        expect(modifiedEvent.start).toEqualDate('2016-09-04T03:00:00Z')
        done()
      })
    })

    it('disallows dragging to non-whitelisted resources', function(done) {
      let calendar = initCalendar()
      let timelineGridWrapper = new ResourceTimelineViewWrapper(calendar).timelineGrid
      let dragging = timelineGridWrapper.dragEventTo(
        timelineGridWrapper.getFirstEventEl(), 'a', '2016-09-04T03:00:00'
      )

      waitEventDrag(calendar, dragging).then((modifiedEvent) => {
        expect(modifiedEvent).toBeFalsy() // failure
        done()
      })
    })
  })
})
