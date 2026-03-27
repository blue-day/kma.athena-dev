import React from 'react';
import {
  DateRangePicker,
  Label,
  Group,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
  RangeCalendar,
  CalendarGrid,
  CalendarHeaderCell,
  CalendarCell,
  Heading,
  DateValue,
  CalendarGridHeader,
  CalendarGridBody,
} from 'react-aria-components';

import '../styles/date-range-picker.css';

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface KmaDateRangePickerProps {
  label?: string;
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
}

export function KmaDateRangePicker({ label, value, onChange }: KmaDateRangePickerProps) {
  return (
    <DateRangePicker
      value={value}
      onChange={onChange}
      className="kma-date-picker"
    >
      {label && <Label className="kma-date-label">{label}</Label>}

      <Group className="kma-date-group">
        <DateInput
          slot="start"
          className="kma-date-input"
        >
          {(segment) => (
            <DateSegment
              segment={segment}
              className={`kma-date-segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
            />
          )}
        </DateInput>

        <span
          aria-hidden="true"
          className="kma-date-separator"
        >
          ~
        </span>

        <DateInput
          slot="end"
          className="kma-date-input"
        >
          {(segment) => (
            <DateSegment
              segment={segment}
              className={`kma-date-segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
            />
          )}
        </DateInput>

        <Button className="kma-date-icon-btn">📅</Button>
      </Group>

      <Popover className="kma-date-popover">
        <Dialog className="kma-date-dialog">
          <RangeCalendar className="w-full">
            <header className="kma-cal-header">
              <Button
                slot="previous"
                className="kma-cal-nav-btn"
              >
                ◀
              </Button>
              <Heading className="kma-cal-title" />
              <Button
                slot="next"
                className="kma-cal-nav-btn"
              >
                ▶
              </Button>
            </header>

            <CalendarGrid className="kma-cal-grid">
              <CalendarGridHeader>
                {(date) => <CalendarHeaderCell className="kma-cal-th">{date}</CalendarHeaderCell>}
              </CalendarGridHeader>

              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={({
                      isSelected,
                      isSelectionStart,
                      isSelectionEnd,
                      isOutsideVisibleRange,
                      isHovered,
                    }) => {
                      const classes = ['kma-cal-cell'];
                      if (isOutsideVisibleRange) classes.push('is-outside');
                      if (isHovered) classes.push('is-hovered');
                      if (isSelected) classes.push('is-selected');
                      if (isSelectionStart) classes.push('is-selection-start');
                      if (isSelectionEnd) classes.push('is-selection-end');
                      return classes.join(' ');
                    }}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
}
