import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import {
  SkyTimepickerModule
} from './timepicker.module';

import {
  TimepickerTestComponent
} from './fixtures/timepicker-component.fixture';

import {
  expect
} from '../testing';

import { By } from '@angular/platform-browser';

let moment = require('moment');

describe('Timepicker calendar', () => {

  let fixture: ComponentFixture<TimepickerTestComponent>;
  let component: TimepickerTestComponent;
  let nativeElement: HTMLElement;

  function verifyTimepicker(
    element: HTMLElement,
    header: string,
    selectedLabel: string,
    activeLabel: string,
    firstSecondaryDate: string
  ) {
    // Daypicker
    // verify month and year header
    expect(element.querySelector('.sky-timepicker-calendar-title'))
      .toHaveText(header);

    // verify selected date
    if (selectedLabel !== '') {
       expect(element.querySelector('td .sky-timepicker-btn-selected'))
      .toHaveText(selectedLabel);
    } else {
      expect(element.querySelector('td .sky-timepicker-btn-selected')).toBeNull();
    }

    // verify active date
    expect(element.querySelector('td .sky-btn-active'))
      .toHaveText(activeLabel);

    // verify secondary date
    if (firstSecondaryDate !== '') {
      let secondaryEl = element.querySelector('tbody tr td .sky-btn-sm');
      expect(secondaryEl)
        .toHaveText(firstSecondaryDate);

      expect(secondaryEl.querySelector('span'))
        .toHaveCssClass('sky-Timepicker-secondary');
    }

  }

  function clickTimepickerTitle(element: HTMLElement) {
    let monthTrigger
      = element.querySelector('.sky-timepicker-calendar-title') as HTMLButtonElement;

    monthTrigger.click();

    fixture.detectChanges();
  }

  function clickNextArrow(element: HTMLElement) {
    let nextArrowEl = element.querySelector('.sky-timepicker-btn-next') as HTMLButtonElement;

    nextArrowEl.click();
    fixture.detectChanges();
  }

  function clickPreviousArrow(element: HTMLElement) {
    let previousArrowEl
      = element.querySelector('.sky-timepicker-btn-previous') as HTMLButtonElement;

    previousArrowEl.click();
    fixture.detectChanges();
  }

  function clickNthDate(element: HTMLElement, index: number) {
    let dateButtonEl
      = element.querySelectorAll('tbody tr td .sky-btn-default').item(index) as HTMLButtonElement;

    dateButtonEl.click();
    fixture.detectChanges();
  }

  function verifyNthDateDisabled(
    element: HTMLElement,
    index: number,
    header: string,
    selectedLabel: string,
    activeLabel: string,
    firstSecondaryDate: string
    ) {
    let dateButtonEl
      = element.querySelectorAll('tbody tr td .sky-btn-default').item(index) as HTMLButtonElement;

    expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

    dateButtonEl.click();
    fixture.detectChanges();
    verifyTimepicker(element, header, selectedLabel, activeLabel, firstSecondaryDate);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimepickerTestComponent
      ],
      imports: [
        SkyTimepickerModule
      ]
    });

    fixture = TestBed.createComponent(TimepickerTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  it('should show the appropriate daypicker with the selected date', () => {

    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    verifyTimepicker(nativeElement, 'April 2017', '04', '04', '26');

    // verify day of week labels
    let dayLabels = nativeElement.querySelectorAll('.sky-timepicker-weekdays');
    expect(dayLabels.item(0)).toHaveText('Su');
    expect(dayLabels.item(1)).toHaveText('Mo');
    expect(dayLabels.item(2)).toHaveText('Tu');
    expect(dayLabels.item(3)).toHaveText('We');
    expect(dayLabels.item(4)).toHaveText('Th');
    expect(dayLabels.item(5)).toHaveText('Fr');
    expect(dayLabels.item(6)).toHaveText('Sa');
  });

  it('should show the month picker with selected date when clicking on the month', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    verifyTimepicker(nativeElement, '2017', 'April', 'April', '');
  });

  it('should show the year picker with selected date when clicking the year', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);

    verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2017', '');
  });

  it('should move to another day within the current month in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNthDate(nativeElement, 7);

    expect(component.selectedDate).toEqual(new Date('4/2/2017'));

    verifyTimepicker(nativeElement, 'April 2017', '02', '02', '26');

  });

  it('should move to another day in the next month in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNthDate(nativeElement, 37);

    verifyTimepicker(nativeElement, 'May 2017', '02', '02', '30');
  });

  it('should move to the next month using arrows in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNextArrow(nativeElement);
    verifyTimepicker(nativeElement, 'May 2017', '', '01', '30');
  });

  it('should move to the previous month using arrows in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickPreviousArrow(nativeElement);

    verifyTimepicker(nativeElement, 'March 2017', '04', '01', '26');
  });

  it('should move to the next month and move to daypicker when clicking a month in monthpicker',
  () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    clickNthDate(nativeElement, 4);

    verifyTimepicker(nativeElement, 'May 2017', '', '01', '30');
  });

  it('should move to the next year when clicking arrows monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    clickNextArrow(nativeElement);

    verifyTimepicker(nativeElement, '2018', '', 'April', '');

  });

  it('should move to the previous year when clicking arrows in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    clickPreviousArrow(nativeElement);

    verifyTimepicker(nativeElement, '2016', '', 'April', '');
  });

  it('should move to the next year and move to monthpicker when clicking year in yearpicker',
  () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);

    clickNthDate(nativeElement, 3);

    verifyTimepicker(nativeElement, '2004', '', 'January', '');

  });

  it('should move to the next set of years when clicking arrows in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);

    clickNextArrow(nativeElement);

    verifyTimepicker(nativeElement, '2021 - 2040', '', '2037', '');
  });

  it('should move to the previous set of years when clicking arrows in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);

    clickPreviousArrow(nativeElement);

    verifyTimepicker(nativeElement, '1981 - 2000', '', '1997', '');
  });

  it('should handle minDate in daypicker', () => {

    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    verifyNthDateDisabled(nativeElement, 6, 'April 2017', '04', '04', '');

  });

  it('should handle maxDate in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/15/2017');
    fixture.detectChanges();

    verifyNthDateDisabled(nativeElement, 28, 'April 2017', '04', '04', '');
  });

  it('should handle minDate in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    verifyNthDateDisabled(nativeElement, 2, '2017', 'April', 'April', '');
  });

  it('should handle maxDate in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/15/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);

    verifyNthDateDisabled(nativeElement, 4, '2017', 'April', 'April', '');
  });

  it('should handle minDate in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);
    clickPreviousArrow(nativeElement);

    verifyNthDateDisabled(nativeElement, 2, '1981 - 2000', '', '1997', '');

    clickNextArrow(nativeElement);

    verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2017', '');

  });

  it('should handle maxDate in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickTimepickerTitle(nativeElement);
    clickTimepickerTitle(nativeElement);
    verifyNthDateDisabled(nativeElement, 19, '2001 - 2020', '2017', '2017', '');
  });

  function verifyTodayDayPicker(element: HTMLElement, todaySelected: boolean = false) {
    let today = new Date();

    let monthLabel = moment(today.getTime()).format('MMMM');

    let yearLabel = moment(today.getTime()).format('YYYY');

    let dayLabel = moment(today.getTime()).format('DD');

    let dayPickerLabel = monthLabel + ' ' + yearLabel;

    let selectedLabel = '';
    if (todaySelected) {
      selectedLabel = dayLabel;
    }

    verifyTimepicker(element, dayPickerLabel, selectedLabel, dayLabel, '');
  }

  it('should open current month in daypicker when no selected date is provided', () => {
    fixture.detectChanges();

    verifyTodayDayPicker(nativeElement);
  });

  it('should handle a different startingDay input', () => {
    component.startingDay = 1;

    fixture.detectChanges();

    let dayLabels = nativeElement.querySelectorAll('.sky-timepicker-weekdays');
    expect(dayLabels.item(6)).toHaveText('Su');
    expect(dayLabels.item(0)).toHaveText('Mo');
    expect(dayLabels.item(1)).toHaveText('Tu');
    expect(dayLabels.item(2)).toHaveText('We');
    expect(dayLabels.item(3)).toHaveText('Th');
    expect(dayLabels.item(4)).toHaveText('Fr');
    expect(dayLabels.item(5)).toHaveText('Sa');
  });

  it('should handle a different startingDay input', () => {
    component.startingDay = 3;
    component.selectedDate = new Date('5/4/2017');

    fixture.detectChanges();

    let dayLabels = nativeElement.querySelectorAll('.sky-timepicker-weekdays');
    expect(dayLabels.item(4)).toHaveText('Su');
    expect(dayLabels.item(5)).toHaveText('Mo');
    expect(dayLabels.item(6)).toHaveText('Tu');
    expect(dayLabels.item(0)).toHaveText('We');
    expect(dayLabels.item(1)).toHaveText('Th');
    expect(dayLabels.item(2)).toHaveText('Fr');
    expect(dayLabels.item(3)).toHaveText('Sa');

    verifyTimepicker(nativeElement, 'May 2017', '04', '04', '26');
  });

  it('should allow users to set selected date using the writeValue function', () => {
    fixture.detectChanges();

    component.Timepicker.writeValue(undefined);
    fixture.detectChanges();
    verifyTodayDayPicker(nativeElement, true);

    component.Timepicker.writeValue(new Date('4/4/2017'));
    fixture.detectChanges();
    verifyTimepicker(nativeElement, 'April 2017', '04', '04', '');

    component.Timepicker.writeValue(new Date('4/4/2017'));
    fixture.detectChanges();
    verifyTimepicker(nativeElement, 'April 2017', '04', '04', '');

  });

  describe('keyboard behaviors', () => {

    function triggerKeydown(
      componentFixture: ComponentFixture<TimepickerTestComponent>,
      eventObj: any
    ) {
      Object.assign(eventObj, {
        stopPropagation: function () {

        },
        preventDefault: function () {

        }
      });

      componentFixture.debugElement.query(By.css('.sky-timepicker-calendar-inner'))
        .triggerEventHandler('keydown', eventObj);
      componentFixture.detectChanges();
    }
    it('should do nothing on shift or alt', () => {

      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      triggerKeydown(fixture, { which: 13, shiftKey: true });
      verifyTimepicker(nativeElement, 'April 2017', '04', '04', '');

      triggerKeydown(fixture, { which: 13, altKey: true});
      verifyTimepicker(nativeElement, 'April 2017', '04', '04', '');
    });

    it('should select active date on enter or space', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();

      clickNextArrow(nativeElement);
      triggerKeydown(fixture, { which: 13 });
      verifyTimepicker(nativeElement, 'May 2017', '01', '01', '');
      expect(component.selectedDate).toEqual(new Date('5/1/2017'));

      clickPreviousArrow(nativeElement);
      triggerKeydown(fixture, { which: 32 });
      verifyTimepicker(nativeElement, 'April 2017', '01', '01', '');
      expect(component.selectedDate).toEqual(new Date('4/1/2017'));

    });

    it('should not select active date when active date is disabled', () => {
      component.selectedDate = new Date('4/4/2017');
      component.maxDate = new Date('4/5/2017');
      fixture.detectChanges();
      clickNextArrow(nativeElement);
      triggerKeydown(fixture, { which: 13 });
      verifyTimepicker(nativeElement, 'May 2017', '', '01', '');
      expect(component.selectedDate).toEqual(new Date('4/4/2017'));
    });

    it('should toggle mode up when doing ctrl + up', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      triggerKeydown(fixture, { which: 38, ctrlKey: true });
      verifyTimepicker(nativeElement, '2017', 'April', 'April', '');

    });

    it('should toggle mode down when doing ctrl + down', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      clickTimepickerTitle(nativeElement);
      triggerKeydown(fixture, { which: 40, ctrlKey: true });
      verifyTimepicker(nativeElement, 'April 2017', '04', '04', '');
    });

    describe('daypicker accessibility', () => {
      it('should move to the previous day when hitting left arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 37 });
        verifyTimepicker(nativeElement, 'April 2017', '04', '03', '');
      });

      it('should move to the next day when hitting the right arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 39 });
        verifyTimepicker(nativeElement, 'April 2017', '04', '05', '');
      });

      it('should move to the next week when hitting the down arrrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 40 });
        verifyTimepicker(nativeElement, 'April 2017', '04', '11', '');
      });

      it('should move to the previous week when hitting the up arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 38 });
        verifyTimepicker(nativeElement, 'March 2017', '04', '28', '');
      });

      it('should move to the next month when using pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 34 });
        verifyTimepicker(nativeElement, 'May 2017', '', '04', '');
      });

      it('should move to the previous month when using pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 33 });
        verifyTimepicker(nativeElement, 'March 2017', '04', '04', '');
      });

      it('should move to the first day of the month when using home', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 36 });
        verifyTimepicker(nativeElement, 'April 2017', '04', '01', '');
      });

      it('should move to the last day of the month when using end', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 35 });
        verifyTimepicker(nativeElement, 'April 2017', '04', '30', '');
      });

      it('handles pressing end button on leap years', () => {
        component.selectedDate = new Date('2/4/2016');
        fixture.detectChanges();
        triggerKeydown(fixture, { which: 35 });
        verifyTimepicker(nativeElement, 'February 2016', '04', '29', '');
      });
    });

    describe('monthpicker accessibility', () => {
      it('should move to the previous month with left arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 37 });
        verifyTimepicker(nativeElement, '2017', 'April', 'March', '');
      });

      it('should move to the next month with right arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 39 });
        verifyTimepicker(nativeElement, '2017', 'April', 'May', '');
      });

      it('should move back appropriately when up arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 38 });
        verifyTimepicker(nativeElement, '2017', 'April', 'January', '');
      });

      it('should move forward appropriately when down arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 40 });
        verifyTimepicker(nativeElement, '2017', 'April', 'July', '');
      });

      it('should move to previous year with pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 33 });
        verifyTimepicker(nativeElement, '2016', '', 'April', '');
      });

      it('should move to the next year with pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 34 });
        verifyTimepicker(nativeElement, '2018', '', 'April', '');
      });

      it('should move to January when home button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 36 });
        verifyTimepicker(nativeElement, '2017', 'April', 'January', '');
      });

      it('should move to December when end button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 35 });
        verifyTimepicker(nativeElement, '2017', 'April', 'December', '');
      });

    });

    describe('year accessibility', () => {
      it('should move to the previous year with left arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 37 });
        verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2016', '');
      });

      it('should move to the next year with right arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 39 });
        verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2018', '');
      });

      it('should move back appropriately when up arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 38 });
        verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2012', '');
      });

      it('should move forward appropriately when down arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 40 });
        verifyTimepicker(nativeElement, '2021 - 2040', '', '2022', '');
      });

      it('should move to next set of year with pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 34 });
        verifyTimepicker(nativeElement, '2021 - 2040', '', '2037', '');

      });

      it('should move to the previous set of year with pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 33 });
        verifyTimepicker(nativeElement, '1981 - 2000', '', '1997', '');

      });

      it('should move to first year in grid when home button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 36 });
        verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2001', '');
      });

      it('should move to last year in grid when end button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickTimepickerTitle(nativeElement);
        clickTimepickerTitle(nativeElement);
        triggerKeydown(fixture, { which: 35 });
        verifyTimepicker(nativeElement, '2001 - 2020', '2017', '2020', '');
      });

    });
  });
});
