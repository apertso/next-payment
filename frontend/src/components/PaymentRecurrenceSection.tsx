import React, { useEffect } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormClearErrors,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PaymentFormInputs } from "./PaymentForm"; // Assuming PaymentFormInputs is exported

interface PaymentRecurrenceSectionProps {
  register: UseFormRegister<PaymentFormInputs>;
  errors: FieldErrors<PaymentFormInputs>;
  setValue: UseFormSetValue<PaymentFormInputs>;
  watchRecurrencePattern: PaymentFormInputs["recurrencePattern"];
  watchRecurrenceEndDate: PaymentFormInputs["recurrenceEndDate"];
  isSubmitting: boolean;
  clearErrors: UseFormClearErrors<PaymentFormInputs>;
}

const PaymentRecurrenceSection: React.FC<PaymentRecurrenceSectionProps> = ({
  register,
  errors,
  setValue,
  watchRecurrencePattern,
  watchRecurrenceEndDate,
  isSubmitting,
  clearErrors,
}) => {
  // Effect for conditional validation of recurrence fields
  // If isRecurrent false, reset pattern and endDate and clear related errors
  useEffect(() => {
    if (!watchRecurrencePattern) {
      // If pattern is cleared
      setValue("recurrenceEndDate", null);
      clearErrors(["recurrenceEndDate"]);
    }
  }, [watchRecurrencePattern, setValue, clearErrors]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
        Настройка повторения
      </label>

      {/* Чекбокс "Повторяющийся" */}

      {/* Условно отображаемые поля рекуррентности */}
      <div className="space-y-4">
        {/* Поле "Повторять" (шаблон) */}
        <div>
          <label
            htmlFor="recurrencePattern"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Повторять
          </label>
          <select
            id="recurrencePattern"
            {...register("recurrencePattern")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 ${
              errors.recurrencePattern ? "border-red-500" : ""
            }`}
            disabled={isSubmitting}
            value={watchRecurrencePattern || ""} // Если null, показываем пустую опцию
            onChange={(e) =>
              setValue(
                "recurrencePattern",
                e.target.value === ""
                  ? null
                  : (e.target.value as PaymentFormInputs["recurrencePattern"]),
                { shouldValidate: true }
              )
            }
          >
            <option value="">-- Выберите шаблон --</option>
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
            <option value="yearly">Ежегодно</option>
          </select>
          {errors.recurrencePattern && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recurrencePattern.message}
            </p>
          )}
        </div>

        {/* Поле "Дата окончания" */}
        <div>
          <label
            htmlFor="recurrenceEndDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Дата окончания (опционально)
          </label>
          <DatePicker
            id="recurrenceEndDate"
            selected={watchRecurrenceEndDate || null}
            onChange={(date: Date | null) =>
              setValue("recurrenceEndDate", date, {
                shouldValidate: true,
              })
            }
            dateFormat="yyyy-MM-dd"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 ${
              errors.recurrenceEndDate ? "border-red-500" : ""
            }`}
            wrapperClassName="w-full"
            disabled={isSubmitting}
            isClearable // Добавляет кнопку очистки
            placeholderText="Выберите дату окончания"
          />
          {errors.recurrenceEndDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recurrenceEndDate.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRecurrenceSection;
