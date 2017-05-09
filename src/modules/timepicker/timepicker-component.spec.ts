import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  NgModel
} from '@angular/forms';

import { SkyTimepickerModule } from './timepicker.module';
import { TimepickerTestComponent } from './fixtures/timepicker-component.fixture';

import { expect } from '../testing';
import { By } from '@angular/platform-browser';
let moment = require('moment');

describe('Timepicker', () => {

  function openTimepicker(element: HTMLElement, compFixture: ComponentFixture<any>) {
    let dropdownButtonEl = element.querySelector('.sky-dropdown-button') as HTMLElement;
    dropdownButtonEl.click();
    compFixture.detectChanges();
  }

  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>) {
    fixture.detectChanges();
    let inputEvent = document.createEvent('Event');
    let params = {
      bubbles: false,
      cancelable: false
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);
    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    let inputEl = element.querySelector('input');
    inputEl.value = text;
    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();
    inputEl.dispatchEvent(changeEvent);
    compFixture.detectChanges();
    tick();
  }

  let fixture: ComponentFixture<TimepickerTestComponent>;
  let component: TimepickerTestComponent;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimepickerTestComponent
      ],
      imports: [
        SkyTimepickerModule,
        FormsModule
      ]
    });

    fixture = TestBed.createComponent(TimepickerTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  function verifyTimepicker(
    element: HTMLElement
  ) {
    fixture.detectChanges();
    fixture.whenStable();
    let sections = element.querySelectorAll('.sky-timepicker-container');
    let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
    let hours = units.item(0).querySelectorAll('button');
    let minutes = units.item(1).querySelectorAll('button');
    if (component.format === 'hh') {
      let meridies = units.item(2).querySelectorAll('button');
      expect(hours.item(0)).toHaveText('1');
      expect(hours.item(11)).toHaveText('12');
      expect(hours.length).toBe(12);
      expect(minutes.item(0)).toHaveText('00');
      expect(minutes.item(11)).toHaveText('55');
      expect(minutes.length).toBe(12);
    }
    if (component.format === 'HH') {
      expect(hours.item(0)).toHaveText('0');
      expect(hours.item(11)).toHaveText('11');
      expect(hours.item(23)).toHaveText('23');
      expect(hours.length).toBe(24);
      expect(minutes.item(0)).toHaveText('00');
      expect(minutes.item(3)).toHaveText('45');
      expect(minutes.length).toBe(4);
    }
  }

  it('should have the twelve hour timepicker', () => {
    component.format = 'hh';
    openTimepicker(nativeElement, fixture);
    verifyTimepicker(nativeElement);
  });

  it('should have the twenty four hour timepicker', () => {
    component.format = 'HH';
    openTimepicker(nativeElement, fixture);
    verifyTimepicker(nativeElement);
  });

  it('should handle input change with a string with the expected format', fakeAsync(() => {
    component.format = 'hh';
    setInput(nativeElement, '2:55 AM', fixture);
    expect(nativeElement.querySelector('input').value).toBe('2:55 AM');
    expect(component.selectedTime).toEqual('2:55 AM');
  }));
  describe('validation', () => {
    let ngModel: NgModel;
    beforeEach(() => {
      let inputElement = fixture.debugElement.query(By.css('input'));
      ngModel = <NgModel>inputElement.injector.get(NgModel);
    });

    it('should have active css when in twelve hour format',
      fakeAsync(() => {
        component.format = 'hh';
        openTimepicker(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
        let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
        let hours = units.item(0).querySelectorAll('button');
        let minutes = units.item(1).querySelectorAll('button');
        let meridies = units.item(2).querySelectorAll('button');
        // Test 2:30 AM
        setInput(nativeElement, '2:30 AM', fixture);
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
        expect(hours.item(1)).toHaveCssClass('active');
        expect(minutes.item(6)).toHaveCssClass('active');
        expect(meridies.item(0)).toHaveCssClass('active');
        // Test 4:55 PM
        setInput(nativeElement, '4:55 PM', fixture);
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
        expect(hours.item(3)).toHaveCssClass('active');
        expect(minutes.item(11)).toHaveCssClass('active');
        expect(meridies.item(1)).toHaveCssClass('active');
      }));

    it('should have active css when in twenty four hour format',
      fakeAsync(() => {
        component.format = 'HH';
        openTimepicker(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
        let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
        let hours = units.item(0).querySelectorAll('button');
        let minutes = units.item(1).querySelectorAll('button');
        // Test 2:30 AM
        setInput(nativeElement, '2:30', fixture);
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        expect(nativeElement.querySelector('input').value).toBe('2:30');
        expect(hours.item(2)).toHaveCssClass('active');
        expect(minutes.item(2)).toHaveCssClass('active');
        // Test 4:45 PM
        setInput(nativeElement, '16:45', fixture);
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        expect(nativeElement.querySelector('input').value).toBe('16:45');
        expect(hours.item(16)).toHaveCssClass('active');
        expect(minutes.item(3)).toHaveCssClass('active');
      }));

    it('should update time on mouse click for twelve four hour format',
      fakeAsync(() => {
        component.format = 'hh';
        openTimepicker(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
        let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
        let hours = units.item(0).querySelectorAll('button');
        let minutes = units.item(1).querySelectorAll('button');
        let meridies = units.item(2).querySelectorAll('button');
        // Test 2:30 AM
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        hours.item(1).click();
        minutes.item(6).click();
        meridies.item(0).click();
        expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
        // Test 4:55 PM
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        hours.item(3).click();
        minutes.item(11).click();
        meridies.item(1).click();
        expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
      }));

    it('should update time on mouse click for twenty four hour format',
      fakeAsync(() => {
        component.format = 'HH';
        openTimepicker(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
        let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
        let hours = units.item(0).querySelectorAll('button');
        let minutes = units.item(1).querySelectorAll('button');
        // Test 2:30 AM
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        hours.item(2).click();
        minutes.item(2).click();
        expect(nativeElement.querySelector('input').value).toBe('02:30');
        // Test 4:45 PM
        fixture.detectChanges();
        openTimepicker(nativeElement, fixture);
        hours.item(16).click();
        minutes.item(3).click();
        expect(nativeElement.querySelector('input').value).toBe('16:45');
      }));

  });
});