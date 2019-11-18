export interface ConditionalProps {
  children: JSX.Element;
  alt?: JSX.Element;
  condition: boolean;
}

const Conditional = (props: ConditionalProps) => {
  return props.condition ? props.children : props.alt || null;
};

export default Conditional;
