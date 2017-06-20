// spell-checker:ignore Colorpicker, Validators, hsva, hsla, cmyk, Dropdown
import {
  ElementRef,
  ViewContainerRef,
  EventEmitter,
  Directive,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { SkyColorpickerService } from './colorpicker.service';
import { SkyColorpickerComponent } from './colorpicker.component';
import {
  SliderPosition,
  SliderDimension,
  Rgba, Hsla, Hsva, Cmyk, SkyColorpickerOutput
} from './colorpicker-classes';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  NG_VALIDATORS,
  AbstractControl
} from '@angular/forms';
import {
  Subscription
} from 'rxjs/Subscription';

// tslint:disable no-forward-ref
const SKY_COLORPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true
};

const SKY_COLORPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true
};
// tslint:enable
@Directive({
  selector: '[skyColorpickerInput]',
  providers: [
    SKY_COLORPICKER_VALUE_ACCESSOR,
    SKY_COLORPICKER_VALIDATOR
  ]
})
export class SkyColorpickerInputDirective
  implements OnInit, OnChanges, ControlValueAccessor, Validator, OnDestroy {

  public pickerChangedSubscription: Subscription;

  @Input()
  public skyColorpickerInput: SkyColorpickerComponent;

  @Input()
  public initialColor: string = '#FFFFFF';

  @Input()
  public returnFormat: string = 'rgba';

  @Input('outputFormat')
  public outputFormat: string = 'rgba';
  @Input('presetColors')
  public presetColors: Array<string>;
  @Input('alphaChannel')
  public alphaChannel: string = 'hex6';

  private colorFormat: string;
  private created: boolean;
  private modelValue: string;

  constructor(
    private view: ViewContainerRef,
    private element: ElementRef,
    private service: SkyColorpickerService,
    private renderer: Renderer,
  ) {
    this.created = false;
  }

  @HostListener('input', ['$event'])
  public changeInput(event: any) {
    let value = event.target.value;
    this.skyColorpickerInput.setColorFromString(value);
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    let newValue = event.target.value;
    this.modelValue = this.formatter(newValue);
    this._validatorChange();
    this._onChange(this.modelValue);
    this.writeModelValue(this.modelValue);
  }

  @HostListener('blur')
  public onBlur() {
    this._onTouched();
  }

  public ngOnInit() {
    this.renderer.setElementClass(this.element.nativeElement, 'sky-form-control', true);
    this.pickerChangedSubscription =
      this.skyColorpickerInput.selectedColorChanged.subscribe((newColor: string) => {
        this.writeValue(this.formatter(newColor));
        this._onChange(newColor);
      });
  }
  public ngOnDestroy() {
    this.pickerChangedSubscription.unsubscribe();
  }

  public openDialog() {
    if (!this.created) {
      this.created = true;
      this.skyColorpickerInput.setDialog(
        this,
        this.element,
        this.skyColorpickerInput,
        this.outputFormat,
        this.presetColors,
        this.alphaChannel
      );

    } else if (this.skyColorpickerInput) {
      this.skyColorpickerInput.openDialog(this.skyColorpickerInput);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._validatorChange();
    this.skyColorpickerInput.initialColor = this.initialColor;
    this.skyColorpickerInput.returnFormat = this.returnFormat;
    this.openDialog();

    /*
        if (changes.skyColorpicker) {
          if (this.skyColorpickerInput) {
            this.skyColorpickerInput.setColorFromString(changes.skyColorpicker.currentValue, false);

          }

        }
        if (changes.presetColors) {
          if (this.skyColorpickerInput) {
            this.skyColorpickerInput.setPresetConfig(this.presetColors);
          }
        }*/


  }
  public colorChanged(value: string) {

  }

  public colorSelected(value: string) {
    // this.colorPickerSelect.emit(value);
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }
  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public writeValue(value: any) {
    this.modelValue = this.formatter(value);
    this.writeModelValue(this.modelValue);
  }
  public validate(control: AbstractControl): { [key: string]: any } {

    let value = control.value;
    if (!value) {
      return;
    }

    if (value.local === 'Invalid Color') {
      return {
        'skyColor': {
          invalid: control.value
        }
      };
    }

  }

  private writeModelValue(model: string) {

    let output: SkyColorpickerOutput;
    let setElementValue: string;
    let hsva: Hsva = this.service.stringToHsva(model);
    let rgba: Rgba = this.service.hsvaToRgba(hsva);
    let hsla: Hsla = this.service.hsva2hsla(hsva);
    let cmyk: Cmyk = this.service.rgbaToCmyk(rgba);
    let hex: string = this.service.outputFormat(hsva, 'hex', false);

    output = {
      'local': model,
      'hsva': hsva,
      'rgba': rgba,
      'hsla': hsla,
      'cmyk': cmyk,
      'hex': hex
    };

    setElementValue = `${output.hex}`;

    if (model) {

      this.renderer.setElementProperty(this.element.nativeElement, 'value', setElementValue);
      this.renderer.setElementStyle(this.element.nativeElement, 'background', `${setElementValue} url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cdefs%3E%3Cpath%20id%3D%22a%22%20d%3D%22M0%200h30v30H0V0zm14.5%204H4v22h14v-8h8V4H14.5z%22%2F%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cuse%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3Cpath%20stroke%3D%22%23CCC%22%20d%3D%22M.5.5v29h29V.5H.5zm18%2018v8h-15v-23h23v15h-8z%22%2F%3E%3Cpath%20fill%3D%22%23292A2B%22%20d%3D%22M23.5%2025L21%2022h5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)`);
      this.renderer.setElementStyle(this.element.nativeElement, 'color', setElementValue);
      this.renderer.setElementStyle(this.element.nativeElement, 'width', '30px');
      this.renderer.setElementStyle(this.element.nativeElement, 'height', '30px');
      this.renderer.setElementStyle(this.element.nativeElement, 'background-repeat', '20px');
      this.renderer.setElementStyle(this.element.nativeElement, 'border', 'none');
      this.renderer.setElementStyle(this.element.nativeElement, 'pointer-events', 'none');
      this.renderer.setElementStyle(this.element.nativeElement, 'z-index', '1000');

      /*
      this.renderer.listen(
        this.element.nativeElement, 'click', (event: Event) => console.log(event)
      );*/

    }
    this.skyColorpickerInput.selectedColor =
      this.service.outputFormat(output.hsva, 'rgba', this.alphaChannel === 'hex8');

  }

  private formatter(color: string) {
    let currentFormat: string;
    let formatColor: string;
    let hsva: Hsva;

    if (this.colorFormat === 'rgb') {
      currentFormat = 'rgba';
    }
    if (this.colorFormat === 'hsv') {
      currentFormat = 'hsva';
    }

    if (typeof this.returnFormat === 'undefined') {
      this.returnFormat = currentFormat;
    }

    hsva = this.service.stringToHsva(color);
    if (hsva === undefined) {
      hsva = this.service.stringToHsva(this.initialColor);
    }

    formatColor = this.service.outputFormat(
      hsva,
      this.outputFormat,
      this.alphaChannel === 'hex8'
    );

    this.skyColorpickerInput.setColorFromString(formatColor);

    return formatColor;

  }
  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };

}
