import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
   initialValue: T;
   validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
   const [values, setValues] = useState<T>(initialValue);
   const [touched, setTouched] = useState<Record<keyof T, boolean>>(
      {} as Record<keyof T, boolean>
   );
   const [errors, setErrors] = useState<Record<keyof T, string>>(
      {} as Record<keyof T, string>
   );

   const handleChange = (name: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
   };

   const handleBlur = (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
   };

   const getInputProps = (name: keyof T) => {
      const value = values[name];
      const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
         handleChange(name, e.target.value);

      const onBlur = () => handleBlur(name);

      return { value, onChange, onBlur };
   };

   useEffect(() => {
      const newErrors = validate(values);
      setErrors(newErrors);
   }, [values]);

   return { values, errors, touched, getInputProps };
}

export default useForm;
