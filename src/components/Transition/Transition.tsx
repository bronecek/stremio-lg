import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

type Props = {
    children: JSX.Element,
    when: boolean,
    name: string,
    duration?: number,
};

const Transition = ({ children, when, name, duration }: Props) => {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    const [state, setState] = useState('enter');
    const [active, setActive] = useState(false);

    const callbackRef = useCallback((element: HTMLElement | null) => {
        setElement(element);
    }, []);

    const className = useMemo(() => {
        const animationClass = `${name}-${state}`;
        const activeClass = active ? `${name}-active` : null;

        return children && classNames(
            children.props.className,
            animationClass,
            activeClass,
        );
    }, [name, state, active, children]);

    const style = useMemo(() => {
        if (duration) return { transitionDuration: `${duration}ms` };
    }, [duration]);

    const onTransitionEnd = useCallback(() => {
        state === 'exit' && setMounted(false);
    }, [state]);

    useEffect(() => {
        setState(when ? 'enter' : 'exit');
        when && setMounted(true);
    }, [when]);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            setActive(!!element);
        });
        return () => cancelAnimationFrame(animationFrame);
    }, [element]);

    useEffect(() => {
        element?.addEventListener('transitionend', onTransitionEnd);
        return () => element?.removeEventListener('transitionend', onTransitionEnd);
    }, [element, onTransitionEnd]);

    // Without a transition (reduced motion, styles that turn them off) no transitionend ever comes.
    useEffect(() => {
        if (state !== 'exit' || !element) return;

        const durations = getComputedStyle(element).transitionDuration.split(',').map((value) => parseFloat(value) || 0);
        if (durations.every((value) => value === 0)) {
            setMounted(false);
        }
    }, [state, element]);

    return (
        mounted && cloneElement(children, {
            ref: callbackRef,
            className,
            style,
        })
    );
};

export default Transition;
