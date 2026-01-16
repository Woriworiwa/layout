export type SerializerType = 'HTML' | 'JSON' | 'CSS-class' | 'CSS-style' | 'CSS-Tailwind';

export type CssSerializerType = Extract<SerializerType, 'CSS-class' | 'CSS-style' | 'CSS-Tailwind'>;
