import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeContent(): Element {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        'p-4 h-dvh w-full',
        isLightMode ? 'bg-white' : 'bg-gray-900'
      )}
    >
      <h1
         className={clsx(
            'text-wxl font-bold',
            isLightMode ? 'text-black' : 'text-white'
         )}
      >
         Theme Content
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Inventore optio, rem a repellat magni veniam corporis debitis quibusdam numquam deleniti aut hic,
      velit illo nemo adipisci similique enim ratione perferendis.
      </p>
    </div>
  );
}