import { getBoundingRect, getLeadingBoundingRect, getTrailingBoundingRect } from 'fullcalendar-tests/lib/dom-geom'
import { CalendarWrapper } from 'fullcalendar-tests/lib/wrappers/CalendarWrapper'
import { ResourceDayGridViewWrapper } from '../lib/wrappers/ResourceDayGridViewWrapper'
import { ResourceTimeGridViewWrapper } from '../lib/wrappers/ResourceTimeGridViewWrapper'


describe('vresource event rendering', function() {
  pushOptions({
    now: '2015-11-17',
    scrollTime: '00:00',
    views: {
      resourceTimeGridTwoDay: {
        type: 'resourceTimeGrid',
        duration: { days: 2 }
      },
      resourceDayGridTwoDay: {
        type: 'resourceDayGrid',
        duration: { days: 2 }
      }
    },
    resources: [
      { id: 'a', title: 'Resource A' },
      { id: 'b', title: 'Resource B' },
      { id: 'c', title: 'Resource C' }
    ]
  })

  describeOptions('direction', {
    'when LTR': 'ltr',
    'when RTL': 'rtl'
  }, function(direction) {

    describeValues({
      'with normal event': null,
      'with background events': 'background'
    }, function(displayType) {

      describe('with a single-day event', function() {

        describeOptions({
          'when resourceTimeGridTwoDay': {
            initialView: 'resourceTimeGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17T12:00:00',
                end: '2015-11-17T02:00:00',
                resourceId: 'c',
                display: displayType
              }
            ]
          },
          'when resourceDayGridTwoDay': {
            initialView: 'resourceDayGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17',
                end: '2015-11-18',
                resourceId: 'c',
                display: displayType
              }
            ]
          }
        }, function(optionsSet) {
          let ViewWrapper = optionsSet.initialView.match(/^resourceDayGrid/) ?
            ResourceDayGridViewWrapper :
            ResourceTimeGridViewWrapper

          describe('when resources above dates', function() {
            pushOptions({
              datesAboveResources: false
            })

            it('renders in the correct column', function() {
              let calendar = initCalendar()
              let headerWrapper = new ViewWrapper(calendar).header

              const colRect = getTrailingBoundingRect(headerWrapper.getDowEls('tue'), direction)
              const eventRect = getBoundingRect('.event1')
              expect(eventRect).toBeMostlyHBoundedBy(colRect)
            })
          })

          describe('when dates above resources', function() {
            pushOptions({
              datesAboveResources: true
            })

            it('renders in the correct column', function() {
              let calendar = initCalendar()
              let headerWrapper = new ViewWrapper(calendar).header

              const resourceRect = getLeadingBoundingRect(headerWrapper.getResourceEls('c'), direction)
              const eventRect = getBoundingRect('.event1')
              expect(eventRect).toBeMostlyHBoundedBy(resourceRect)
            })
          })
        })
      })

      describe('when a multi-day event', function() {

        describe('when resourceTimeGridTwoDay', function() {
          pushOptions({
            initialView: 'resourceTimeGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17T12:00:00',
                end: '2015-11-18T12:00:00',
                resourceId: 'c',
                display: displayType
              }
            ]
          })

          describe('when resources above dates', function() {
            pushOptions({
              datesAboveResources: false
            })

            it('renders in the correct columns', function() {
              let calendar = initCalendar()
              let headerWrapper = new ResourceTimeGridViewWrapper(calendar).header

              const eventEls = $('.event1')
              expect(eventEls.length).toBe(2)
              const firstEventRect = getLeadingBoundingRect(eventEls, direction)
              const lastEventRect = getTrailingBoundingRect(eventEls, direction)
              if (!displayType) { // non-background events
                expect(firstEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_START_CLASSNAME)
                expect(lastEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_END_CLASSNAME)
              }
              const tueRect = getTrailingBoundingRect(headerWrapper.getDowEls('tue'), direction)
              const wedRect = getTrailingBoundingRect(headerWrapper.getDowEls('wed'), direction)
              expect(firstEventRect).toBeMostlyHBoundedBy(tueRect)
              expect(lastEventRect).toBeMostlyHBoundedBy(wedRect)
            })
          })

          describe('when dates above resources', function() {
            pushOptions({
              datesAboveResources: true
            })

            it('renders in the correct columns', function() {
              let calendar = initCalendar()
              let headerWrapper = new ResourceTimeGridViewWrapper(calendar).header

              const eventEls = $('.event1')
              expect(eventEls.length).toBe(2)
              const firstEventRect = getLeadingBoundingRect(eventEls, direction)
              const lastEventRect = getTrailingBoundingRect(eventEls, direction)
              if (!displayType) { // non-background events
                expect(firstEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_START_CLASSNAME)
                expect(lastEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_END_CLASSNAME)
              }
              const resourceEls = headerWrapper.getResourceEls('c')
              const firstResourceRect = getLeadingBoundingRect(resourceEls, direction)
              const lastResourceRect = getTrailingBoundingRect(resourceEls, direction)
              expect(firstEventRect).toBeMostlyHBoundedBy(firstResourceRect)
              expect(lastEventRect).toBeMostlyHBoundedBy(lastResourceRect)
            })
          })
        })

        describe('when resourceDayGridTwoDay', function() {
          pushOptions({
            initialView: 'resourceDayGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17',
                end: '2015-11-19',
                resourceId: 'c',
                display: displayType
              }
            ]
          })

          describe('when resources above dates', function() {
            pushOptions({
              datesAboveResources: false
            })

            it('renders in the correct columns', function() {
              let calendar = initCalendar()
              let headerWrapper = new ResourceDayGridViewWrapper(calendar).header

              const eventRect = getBoundingRect('.event1')
              const tueRect = getTrailingBoundingRect(headerWrapper.getDowEls('tue'), direction)
              const wedRect = getTrailingBoundingRect(headerWrapper.getDowEls('wed'), direction)
              expect(tueRect).toBeMostlyHBoundedBy(eventRect)
              expect(wedRect).toBeMostlyHBoundedBy(eventRect)
            })
          })

          describe('when dates above resources', function() {
            pushOptions({
              datesAboveResources: true
            })

            it('renders in the correct columns', function() {
              let calendar = initCalendar()
              let headerWrapper = new ResourceDayGridViewWrapper(calendar).header

              const eventEls = $('.event1')
              expect(eventEls.length).toBe(2)
              const firstEventRect = getLeadingBoundingRect(eventEls, direction)
              const lastEventRect = getTrailingBoundingRect(eventEls, direction)
              if (!displayType) { // non-background events
                expect(firstEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_START_CLASSNAME)
                expect(lastEventRect.node).toHaveClass(CalendarWrapper.EVENT_IS_END_CLASSNAME)
              }
              const resourceEls = headerWrapper.getResourceEls('c')
              const firstResourceRect = getLeadingBoundingRect(resourceEls, direction)
              const lastResourceRect = getTrailingBoundingRect(resourceEls, direction)
              expect(firstEventRect).toBeMostlyHBoundedBy(firstResourceRect)
              expect(lastEventRect).toBeMostlyHBoundedBy(lastResourceRect)
            })
          })
        })
      })

      describe('with an event with no resources', function() {

        describeOptions({
          'when resourceTimeGridTwoDay': {
            initialView: 'resourceTimeGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17T12:00:00',
                end: '2015-11-17T02:00:00',
                display: displayType
              }
            ]
          },
          'when resourceDayGridTwoDay': {
            initialView: 'resourceDayGridTwoDay',
            events: [
              {
                title: 'event 1',
                className: 'event1',
                start: '2015-11-17',
                end: '2015-11-18',
                display: displayType
              }
            ]
          }
        }, function() {

          describeOptions({
            'when resources above dates': {
              datesAboveResources: false
            },
            'when dates above resources': {
              datesAboveResources: true
            }
          }, function() {

            if (displayType === 'background') {

              it('renders on every resource', function() {
                initCalendar()
                const eventEls = $('.event1')
                expect(eventEls.length).toBe(3)
              })
            } else {

              it('doesn\'t render at all', function() {
                initCalendar()
                const eventEls = $('.event1')
                expect(eventEls.length).toBe(0)
              })
            }
          })
        })
      })
    })
  })

  describe('with an event with multiple', function() {
    pushOptions({
      events: [{
        title: 'event 1',
        className: 'event1',
        start: '2015-11-17T01:00:00',
        end: '2015-11-17T05:00:00',
        resourceIds: [ 'a', 'b' ]
      }]
    })

    it('renders each event in a separate resource column', function() {
      initCalendar({
        initialView: 'resourceTimeGridDay'
      })
      expect($('.event1').length).toBe(2)
    })

    it('renders a single event when no resource columns', function() {
      initCalendar({
        initialView: 'timeGridTwoDay',
        views: {
          timeGridTwoDay: {
            type: 'timeGrid',
            duration: { days: 2 }
          }
        }
      })
      expect($('.event1').length).toBe(1)
    })
  })
})
