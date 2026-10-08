type IconName = 'github' | 'linkedin' | 'strava' | 'email' | 'arrow' | 'lock' | 'spark';

type IconProps = {
  name: IconName;
  className?: string;
};

const icons: Record<IconName, JSX.Element> = {
  github: (
    <path
      d="M12 2C6.48 2 2 6.52 2 12.08c0 4.44 2.87 8.2 6.84 9.54.5.1.68-.22.68-.48v-1.71c-2.78.62-3.37-1.16-3.37-1.16-.45-1.17-1.1-1.48-1.1-1.48-.9-.62.07-.61.07-.61 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.33 1.12 2.9.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.39-2.02 1.04-2.73-.11-.26-.45-1.31.1-2.72 0 0 .85-.28 2.78 1.04a9.52 9.52 0 0 1 5.07 0c1.93-1.32 2.78-1.04 2.78-1.04.55 1.41.21 2.46.10 2.72.65.71 1.04 1.62 1.04 2.73 0 3.91-2.34 4.77-4.57 5.02.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.1 10.1 0 0 0 22 12.08C22 6.52 17.52 2 12 2Z"
      fill="currentColor"
    />
  ),
  linkedin: (
    <path
      d="M6.94 6.5A1.94 1.94 0 1 1 3.05 6.5a1.94 1.94 0 0 1 3.89 0Zm.1 3.5H3V21h4.04V10ZM13.54 10h-3.87v11h3.93v-5.77c0-3.22 4.2-3.49 4.2 0V21h3.93v-6.96c0-5.42-6.21-5.23-8.19-2.55V10Z"
      fill="currentColor"
    />
  ),
  strava: (
    <path
      d="M12 2 6 13h4l2-4.1L14 13h4L12 2Zm5 16.5-2.4-4.4-2 4.4H8.4L12 23l3.6-4.5H17Z"
      fill="currentColor"
    />
  ),
  email: (
    <path
      d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2V17h16V8.2l-8 5.2-8-5.2Zm14.2-1.2H5.8L12 11.8l6.2-4.8Z"
      fill="currentColor"
    />
  ),
  arrow: (
    <path
      d="m13.2 5 6 6-6 6-1.4-1.4 3.6-3.6H5v-2h10.4l-3.6-3.6L13.2 5Z"
      fill="currentColor"
    />
  ),
  lock: (
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0h6V8a3 3 0 0 0-6 0v2Zm3 4a1.5 1.5 0 0 0-.75 2.8V19h1.5v-2.2A1.5 1.5 0 0 0 12 14Z"
      fill="currentColor"
    />
  ),
  spark: (
    <path
      d="m12 2 1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2Zm7 10 1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1 1-2.7Z"
      fill="currentColor"
    />
  )
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}
