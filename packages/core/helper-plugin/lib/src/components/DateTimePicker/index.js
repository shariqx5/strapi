import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Stack } from '@strapi/design-system/Stack';
import { DatePicker } from '@strapi/design-system/DatePicker';
import { TimePicker } from '@strapi/design-system/TimePicker';
import { Field, FieldHint, FieldLabel, FieldError } from '@strapi/design-system/Field';
import { Flex } from '@strapi/design-system/Flex';
import { Box } from '@strapi/design-system/Box';
import { parseDate } from './parseDate';

const CustomField = styled(Field)`
  > div {
    > div {
      p[data-strapi-field-error='true'] {
        display: none;
      }
    }
  }
`;

const LabelAction = styled(Box)`
  svg path {
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

const DateTimePicker = ({
  clearLabel,
  disabled,
  error,
  hint,
  label,
  labelAction,
  onChange,
  onClear,
  name,
  required,
  size,
  value,
  ...props
}) => {
  const initialDate = parseDate(value);
  const [dateValue, setDateValue] = useState(initialDate);
  const [timeValue, setTimeValue] = useState(
    initialDate
      ? `${initialDate.getHours()}:${initialDate.getMinutes()}:${initialDate.getSeconds()}`
      : null
  );

  const handleDateChange = e => {
    setDateValue(e);

    if (timeValue) {
      const dateToSet = new Date(e);
      dateToSet.setHours(timeValue.split(':')[0]);
      dateToSet.setMinutes(timeValue.split(':')[1]);

      if (onChange) {
        onChange(dateToSet);
      }
    } else {
      const dateToSet = new Date(e);
      setTimeValue(`${dateToSet.getHours()}:${dateToSet.getMinutes()}:${dateToSet.getSeconds()}`);

      if (onChange) {
        onChange(dateToSet);
      }
    }
  };

  const handleTimeChange = e => {
    setTimeValue(e);

    const dateToSet = new Date(dateValue);
    dateToSet.setHours(e.split(':')[0]);
    dateToSet.setMinutes(e.split(':')[1]);

    if (!dateValue) {
      setDateValue(new Date());
    }

    if (onChange) {
      onChange(dateToSet);
    }
  };

  const handleDateClear = () => {
    setDateValue(undefined);
    setTimeValue(undefined);
    onClear();
  };

  const handleTimeClear = () => {
    setTimeValue(undefined);

    if (dateValue && onChange) {
      const dateToSet = new Date(dateValue);
      dateToSet.setHours('00');
      dateToSet.setMinutes('00');

      onChange(dateToSet);
    }
  };

  return (
    <CustomField
      name={name}
      role="group"
      aria-labelledby="datetime-label"
      hint={hint}
      error={error}
    >
      <Stack size={1}>
        {label && (
          <Flex>
            <FieldLabel required={required} id="datetime-label">
              {label}
            </FieldLabel>
            {labelAction && <LabelAction paddingLeft={1}>{labelAction}</LabelAction>}
          </Flex>
        )}
        <Stack horizontal size={2}>
          <DatePicker
            data-testid="datetimepicker-date"
            name={name}
            ariaLabel={label}
            error={error}
            selectedDate={dateValue}
            selectedDateLabel={formattedDate => `Date picker, current is ${formattedDate}`}
            onChange={handleDateChange}
            size={size}
            onClear={onClear && handleDateClear}
            clearLabel={clearLabel}
            disabled={disabled}
            {...props}
          />
          <TimePicker
            data-testid="datetimepicker-time"
            size={size}
            aria-label={label}
            error={error}
            value={timeValue}
            onChange={handleTimeChange}
            onClear={onClear && handleTimeClear}
            clearLabel={clearLabel}
            disabled={disabled}
          />
        </Stack>
        <FieldHint />
        <FieldError id="datetimepicker" />
      </Stack>
    </CustomField>
  );
};

DateTimePicker.displayName = 'DateTimePicker';

DateTimePicker.defaultProps = {
  clearLabel: 'clear',
  disabled: false,
  error: undefined,
  labelAction: undefined,
  onClear: undefined,
  required: false,
  size: 'M',
  value: undefined,
};

DateTimePicker.propTypes = {
  clearLabel: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelAction: PropTypes.element,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['S', 'M']),
  value: PropTypes.instanceOf(Date),
};

export default DateTimePicker;