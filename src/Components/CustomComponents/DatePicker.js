import {useState,useMemo} from 'react';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parse, format, isValid } from 'date-fns';

export default function CustomDatePicker({ label, value, onChange, disabled, placeholder }) {
  // Convert incoming value (e.g., "30-06-2025") to Date
  const initialDate = useMemo(() => {
    if (typeof value === 'string') {
      const parsed = parse(value, 'dd-MM-yyyy', new Date());
      return isValid(parsed) ? parsed : null;
    }
    return value || null;
  }, [value]);

  const [selectedDate, setSelectedDate] = useState(initialDate);
 const handleChange = (newValue) => {
    setSelectedDate(newValue);
    if (onChange && isValid(newValue)) {
      const formatted = format(newValue, 'dd-MM-yyyy');
      onChange(formatted);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={selectedDate}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            placeholder: placeholder || `Select ${label}`,
            variant: 'outlined',
            error: false,
            label: '', // ❌ No floating label
            InputLabelProps: { shrink: false },
            sx: {
              backgroundColor: '#fff', // ✅ Background color fixed
              '& .MuiInputBase-root': {
                height: 36,
                fontSize: '0.85rem',
              },
              '& .MuiInputBase-input': {
                padding: '8px 10px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
            },
          }
        }}
      />
    </LocalizationProvider>
  );
}
