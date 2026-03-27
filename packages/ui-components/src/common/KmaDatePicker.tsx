import React from 'react';
import {
  DatePicker,
  Label,
  Group,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
  Calendar,
  CalendarGrid,
  CalendarHeaderCell,
  CalendarCell,
  Heading,
  DateValue,
  CalendarGridHeader,
  CalendarGridBody,
} from 'react-aria-components';

import '../styles/date-range-picker.css'; // 기존 RangePicker의 CSS 스타일 재사용

export interface KmaDatePickerProps {
  label?: string;
  value?: DateValue | null;
  onChange?: (value: DateValue | null) => void;
  isDisabled?: boolean; // 읽기 전용/비활성화 처리용
}

export function KmaDatePicker({ label, value, onChange, isDisabled }: KmaDatePickerProps) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      className="kma-date-picker"
    >
      {label && <Label className="kma-date-label">{label}</Label>}

      <Group className="kma-date-group">
        <DateInput className="kma-date-input">
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
          <Calendar className="w-full">
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
                    className={({ isSelected, isOutsideVisibleRange, isHovered }) => {
                      const classes = ['kma-cal-cell'];
                      if (isOutsideVisibleRange) classes.push('is-outside');
                      if (isHovered) classes.push('is-hovered');
                      if (isSelected) classes.push('is-selected');
                      return classes.join(' ');
                    }}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
