/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { CandyDate, FunctionProp } from 'ng-zorro-antd/core';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';
import { PREFIX_CLASS } from './name';
import { DisabledDateFn, PanelMode, SupportTimeOptions } from './standard-types';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'inner-popup',
  exportAs: 'innerPopup',
  template: `
    <div [class.ant-picker-datetime-panel]="showTimePicker">
      <div class="{{ prefixCls }}-{{ panelMode }}-panel">
        <ng-container [ngSwitch]="panelMode">
          <ng-container *ngSwitchCase="'decade'">
            <decade-header
              [(value)]="activeDate"
              [locale]="locale"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelModeChange)="panelModeChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            >
            </decade-header>
            <div class="{{ prefixCls }}-body">
              <decade-table
                [showWeek]="showWeek"
                [activeDate]="activeDate"
                [value]="value"
                (valueChange)="onChooseDecade($event)"
                [disabledDate]="disabledDate"
                [cellRender]="dateRender"
              ></decade-table>
            </div>
          </ng-container>
          <ng-container *ngSwitchCase="'year'">
            <year-header
              [(value)]="activeDate"
              [locale]="locale"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelModeChange)="panelModeChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            >
            </year-header>
            <div class="{{ prefixCls }}-body">
              <year-table
                [showWeek]="showWeek"
                [activeDate]="activeDate"
                [value]="value"
                (valueChange)="onChooseYear($event)"
                [disabledDate]="disabledDate"
                [cellRender]="dateRender"
              ></year-table>
            </div>
          </ng-container>
          <ng-container *ngSwitchCase="'month'">
            <month-header
              [(value)]="activeDate"
              [locale]="locale"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelModeChange)="panelModeChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            >
            </month-header>
            <div class="{{ prefixCls }}-body">
              <month-table
                [showWeek]="showWeek"
                [value]="value"
                [activeDate]="activeDate"
                [disabledDate]="disabledDate"
                [cellRender]="dateRender"
                (dayHover)="dayHover.emit($event)"
                (valueChange)="onChooseMonth($event)"
              ></month-table>
            </div>
          </ng-container>

          <ng-container *ngSwitchDefault>
            <date-header
              [(value)]="activeDate"
              [locale]="locale"
              (panelModeChange)="panelModeChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            >
            </date-header>
            <div class="{{ prefixCls }}-body">
              <date-table
                [locale]="locale"
                [showWeek]="showWeek"
                [value]="value"
                [activeDate]="activeDate"
                (valueChange)="onSelectDate($event)"
                [disabledDate]="disabledDate"
                [cellRender]="dateRender"
                [selectedValue]="selectedValue"
                [hoverValue]="hoverValue"
                (dayHover)="dayHover.emit($event)"
              ></date-table>
            </div>
          </ng-container>
        </ng-container>
      </div>
      <ng-container *ngIf="showTimePicker && timeOptions">
        <nz-time-picker-panel
          [nzInDatePicker]="true"
          [ngModel]="value?.nativeDate"
          (ngModelChange)="onSelectTime($event)"
          [format]="timeOptions.nzFormat"
          [nzHourStep]="timeOptions.nzHourStep"
          [nzMinuteStep]="timeOptions.nzMinuteStep"
          [nzSecondStep]="timeOptions.nzSecondStep"
          [nzDisabledHours]="timeOptions.nzDisabledHours"
          [nzDisabledMinutes]="timeOptions.nzDisabledMinutes"
          [nzDisabledSeconds]="timeOptions.nzDisabledSeconds"
          [nzHideDisabledOptions]="timeOptions.nzHideDisabledOptions"
          [nzDefaultOpenValue]="timeOptions.nzDefaultOpenValue"
          [nzUse12Hours]="timeOptions.nzUse12Hours"
          [nzAddOn]="timeOptions.nzAddOn"
          [opened]="true"
        ></nz-time-picker-panel>
        <!-- use [opened] to trigger time panel \`initPosition()\` -->
      </ng-container>
    </div>
  `
})
export class InnerPopupComponent implements OnChanges {
  @Input() activeDate: CandyDate;
  @Input() endPanelMode: PanelMode;
  @Input() panelMode: PanelMode;
  @Input() showWeek: boolean;
  @Input() locale: NzCalendarI18nInterface;
  @Input() showTimePicker: boolean;
  @Input() timeOptions: SupportTimeOptions;
  @Input() enablePrev: boolean;
  @Input() enableNext: boolean;
  @Input() disabledDate: DisabledDateFn;
  @Input() dateRender: FunctionProp<TemplateRef<Date> | string>;
  @Input() selectedValue: CandyDate[]; // Range ONLY
  @Input() hoverValue: CandyDate[]; // Range ONLY
  @Input() value: CandyDate;

  @Output() readonly panelModeChange = new EventEmitter<PanelMode>();

  // TODO: name is not proper
  @Output() readonly headerChange = new EventEmitter<CandyDate>(); // Emitted when user changed the header's value
  @Output() readonly selectDate = new EventEmitter<CandyDate>(); // Emitted when the date is selected by click the date panel
  @Output() readonly selectTime = new EventEmitter<CandyDate>();
  @Output() readonly dayHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter

  prefixCls: string = PREFIX_CLASS;

  onSelectTime(date: Date): void {
    this.selectTime.emit(new CandyDate(date));
  }

  // The value real changed to outside
  onSelectDate(date: CandyDate | Date): void {
    const value = date instanceof CandyDate ? date : new CandyDate(date);
    const timeValue = this.timeOptions && this.timeOptions.nzDefaultOpenValue;

    // Display timeValue when value is null
    if (!this.value && timeValue) {
      value.setHms(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds());
    }

    this.selectDate.emit(value);
  }

  onChooseMonth(value: CandyDate): void {
    this.activeDate = this.activeDate.setMonth(value.getMonth());
    if (this.endPanelMode === 'month') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.panelModeChange.emit(this.endPanelMode);
    }
  }

  onChooseYear(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'year') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.panelModeChange.emit(this.endPanelMode);
    }
  }

  onChooseDecade(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'decade') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.panelModeChange.emit('year');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeDate && !changes.activeDate.currentValue) {
      this.activeDate = new CandyDate();
    }
    // New Antd vesion has merged 'date' ant 'time' to one panel,
    // So there is not 'time' panel
    if (changes.panelMode && changes.panelMode.currentValue === 'time') {
      this.panelMode = 'date';
    }
  }
}
