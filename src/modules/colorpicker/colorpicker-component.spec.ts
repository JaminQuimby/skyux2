// spell-checker:ignore Colorpicker, dropdown, cmyk, hsla
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SkyColorpickerModule } from './colorpicker.module';
import { ColorpickerTestComponent } from './fixtures/colorpicker-component.fixture';
import { expect } from '../testing';

describe('Colorpicker Component', () => {

  function openColorpicker(element: HTMLElement, compFixture: ComponentFixture<any>) {
    let dropdownButtonEl = element.querySelector('.sky-dropdown-button') as HTMLElement;
    dropdownButtonEl.click();
    compFixture.detectChanges();
  }

  function setPresetColor(element: HTMLElement, compFixture: ComponentFixture<any>, key: number) {
    let presetColors = element.querySelectorAll('.sky-preset-color') as NodeListOf<HTMLElement>;
    let applyColor = element.querySelector('.sky-btn-colorpicker-apply') as HTMLButtonElement;
    presetColors[key].click();
    applyColor.click();
    applyColor.click();
    compFixture.detectChanges();
  }

  let fixture: ComponentFixture<ColorpickerTestComponent>;
  let component: ColorpickerTestComponent;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorpickerTestComponent
      ],
      imports: [
        SkyColorpickerModule,
        FormsModule
      ]
    });

    fixture = TestBed.createComponent(ColorpickerTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  function verifyColorpicker(element: HTMLElement, spaColor: string, colorPreview: string) {
    fixture.detectChanges();
    fixture.whenStable();
    let inputElement: HTMLInputElement = element.querySelector('input');
    expect(inputElement.value).toBe(spaColor);
    let selectedColor: HTMLDivElement = <HTMLDivElement>element.querySelector('.selected-color');
    expect(selectedColor.style.backgroundColor).toBe(colorPreview);
  }

  function getElementCords(elementRef: any) {
    let el = elementRef.nativeElement;
    let parent = el.offsetParent;
    let left = el.offsetLeft + parent.offsetLeft;
    let top = el.offsetTop + el.scrollHeight + (el.height || 0) / 2;
    let width = el.offsetWidth;
    let xMiddle = left + (width / 2);
    return { 'middle': xMiddle, 'top': top };
  }

  function setInputElementValue(element: HTMLElement, name: string, value: string) {
    fixture.detectChanges();
    fixture.whenStable();
    let inputElement: NodeListOf<Element> =
      element.querySelectorAll('.rgba-text > div:last-child > input');
    let input = {
      'hex': inputElement[0],
      'red': inputElement[1],
      'green': inputElement[2],
      'blue': inputElement[3],
      'alpha': inputElement[4]
    };
    input[name].value = value;
    let params = {
      'bubbles': false,
      'cancelable': false
    };
    let inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', params.bubbles, params.cancelable);
    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    input[name].dispatchEvent(inputEvent);
    input[name].dispatchEvent(changeEvent);
    fixture.detectChanges();
    fixture.whenStable();
    return input[name];
  }

  it('should output RGBA', () => {
    component.selectedOutputFormat = 'rgba';
    openColorpicker(nativeElement, fixture);
    setPresetColor(nativeElement, fixture, 4);
    verifyColorpicker(nativeElement, 'rgba(189,64,64,1)', 'rgb(189, 64, 64)');
  });

  it('should output HEX', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setPresetColor(nativeElement, fixture, 4);
    verifyColorpicker(nativeElement, '#bd4040', 'rgb(189, 64, 64)');
  });

  it('Should accept a new HEX3 color.', () => {
    component.selectedOutputFormat = 'rgba';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#BC4');
    verifyColorpicker(nativeElement, 'rgba(187,204,68,1)', 'rgb(187, 204, 68)');
  });

  it('Should accept a new HEX6 color.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#BFF666');
    verifyColorpicker(nativeElement, '#bff666', 'rgb(191, 246, 102)');
  });

  it('Should accept a new RGB color.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'red', '77');
    setInputElementValue(nativeElement, 'green', '58');
    setInputElementValue(nativeElement, 'blue', '183');
    verifyColorpicker(nativeElement, '#4d3ab7', 'rgb(77, 58, 183)');
  });

  it('Should accept a new RGBA color.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'red', '163');
    setInputElementValue(nativeElement, 'green', '19');
    setInputElementValue(nativeElement, 'blue', '84');
    setInputElementValue(nativeElement, 'alpha', '0.3');
    verifyColorpicker(nativeElement, '#a31354', 'rgba(163, 19, 84, 0.3)');
  });

  it('Should allow user to click cancel the color change.', () => {
    let button = nativeElement.querySelector('.sky-btn-colorpicker-close');
    let buttonEvent = document.createEvent('Event');
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#BFF666');
    verifyColorpicker(nativeElement, '#bff666', 'rgb(191, 246, 102)');
    buttonEvent.initEvent('click', true, false);
    button.dispatchEvent(buttonEvent);
    verifyColorpicker(nativeElement, '#2889e5', 'rgb(40, 137, 229)');
  });

  it('Should allow user to click apply the color change.', () => {
    let button = nativeElement.querySelector('.sky-btn-colorpicker-apply');
    let buttonEvent = document.createEvent('Event');
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#BFF666');
    verifyColorpicker(nativeElement, '#bff666', 'rgb(191, 246, 102)');
    buttonEvent.initEvent('click', true, false);
    button.dispatchEvent(buttonEvent);
    verifyColorpicker(nativeElement, '#bff666', 'rgb(191, 246, 102)');
  });

  it('Should allow user to esc cancel the color change.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#086A93');
    verifyColorpicker(nativeElement, '#086a93', 'rgb(8, 106, 147)');
    let document = nativeElement.parentNode.parentNode.parentNode;
    const escapeKeyPress = new KeyboardEvent('keydown', {
      'key': 'Escape',
      'code': 'Escape',
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    document.dispatchEvent(escapeKeyPress);
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#2889e5', 'rgb(40, 137, 229)');
  });

  it('Should accepts mouse down events on hue bar.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    let hueBar = fixture.debugElement.query(By.css('.hue'));
    let axis = getElementCords(hueBar);
    hueBar.triggerEventHandler('mousedown', { 'pageX': axis.middle, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#28e5e5', 'rgb(40, 229, 229)');
    hueBar.triggerEventHandler('mousedown', { 'pageX': axis.middle - 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#a3e528', 'rgb(163, 229, 40)');
    hueBar.triggerEventHandler('mousedown', { 'pageX': axis.middle + 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#a328e5', 'rgb(163, 40, 229)');
  });

  it('Should accept mouse down events on alpha bar.', () => {
    component.selectedOutputFormat = 'rgba';
    openColorpicker(nativeElement, fixture);
    let alphaBar = fixture.debugElement.query(By.css('.alpha'));
    let axis = getElementCords(alphaBar);
    alphaBar.triggerEventHandler('mousedown', { 'pageX': axis.middle, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, 'rgba(40,137,229,0.5)', 'rgba(40, 137, 229, 0.5)');
    alphaBar.triggerEventHandler('mousedown', { 'pageX': axis.middle - 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, 'rgba(40,137,229,0.23)', 'rgba(40, 137, 229, 0.23)');
    alphaBar.triggerEventHandler('mousedown', { 'pageX': axis.middle + 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, 'rgba(40,137,229,0.77)', 'rgba(40, 137, 229, 0.77)');
  });

  it('Should accept mouse down events on saturation and lightness.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    let slBar = fixture.debugElement.query(By.css('.saturation-lightness'));
    let axis = getElementCords(slBar);
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#101921', 'rgb(16, 25, 33)');
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle - 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#171c21', 'rgb(23, 28, 33)');
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle - 50, 'pageY': axis.top / 2 });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#6e87a1', 'rgb(110, 135, 161)');
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle, 'pageY': axis.top / 2 });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#5078a1', 'rgb(80, 120, 161)');
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle + 50, 'pageY': axis.top / 2 });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#3369a1', 'rgb(51, 105, 161)');
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle + 50, 'pageY': axis.top });
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#0a1521', 'rgb(10, 21, 33)');
  });

  it('Should accept mouse dragging on saturation and lightness.', () => {
    component.selectedOutputFormat = 'hex';
    openColorpicker(nativeElement, fixture);
    let document = nativeElement.parentNode.parentNode.parentNode;
    let slBar = fixture.debugElement.query(By.css('.saturation-lightness'));
    let axis = getElementCords(slBar);
    slBar.triggerEventHandler('mousedown', { 'pageX': axis.middle, 'pageY': axis.top });
    fixture.detectChanges();
    let mouseEvent = new MouseEvent('mousemove',
      {
        'clientX': axis.middle - 50,
        'clientY': axis.top - 50
      });
    mouseEvent.initEvent('mousemove', true, true);
    document.dispatchEvent(mouseEvent);
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#4a5c6c', 'rgb(74, 92, 108)');
    mouseEvent = new MouseEvent('mousemove',
      {
        'clientX': axis.middle + 50,
        'clientY': axis.top - 100
      });
    mouseEvent.initEvent('mousemove', true, true);
    document.dispatchEvent(mouseEvent);
    fixture.detectChanges();
    verifyColorpicker(nativeElement, '#3a7cb7', 'rgb(58, 124, 183)');
    mouseEvent = new MouseEvent('mouseup', {
      'bubbles': true,
      'cancelable': true,
      'view': window
    });
    mouseEvent.initEvent('mouseup', true, true);
    document.dispatchEvent(mouseEvent);
    fixture.detectChanges();
  });

  it('Should output HSLA in css format.', () => {
    component.selectedOutputFormat = 'hsla';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#123456');
    verifyColorpicker(nativeElement, 'hsla(210,65%,20%,1)', 'rgb(18, 51, 84)');
  });

  it('Should accept HEX8 alpha conversions.', () => {
    component.selectedHexType = 'hex8';
    component.selectedOutputFormat = 'rgba';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#12345680');
    verifyColorpicker(nativeElement, 'rgba(18,52,86,0.5)', 'rgba(18, 52, 86, 0.5)');
  });

  it('Should output CMYK in css format.', () => {
    component.selectedOutputFormat = 'cmyk';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'hex', '#654321');
    verifyColorpicker(nativeElement, 'cmyk(0%,34%,67%,60%)', 'rgb(101, 67, 33)');
  });

  it('Should accept transparency', () => {
    component.selectedOutputFormat = 'hsla';
    openColorpicker(nativeElement, fixture);
    setInputElementValue(nativeElement, 'red', '0');
    setInputElementValue(nativeElement, 'green', '0');
    setInputElementValue(nativeElement, 'blue', '0');
    setInputElementValue(nativeElement, 'alpha', '0');
    verifyColorpicker(nativeElement, 'hsla(0,0%,0%,0)', 'rgba(0, 0, 0, 0)');
  });

  it('Should accept color change through directive host listener', () => {
    component.selectedOutputFormat = 'rgba';
    openColorpicker(nativeElement, fixture);
    nativeElement.querySelector('input').value = '#4523FC';
    let inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', true, false);
    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', true, false);
    nativeElement.querySelector('input').dispatchEvent(inputEvent);
    nativeElement.querySelector('input').dispatchEvent(changeEvent);
    fixture.detectChanges();
    verifyColorpicker(nativeElement, 'rgba(69,35,252,1)', 'rgb(69, 35, 252)');
  });

});
