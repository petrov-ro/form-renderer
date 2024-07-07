import {useEffect, useRef} from 'react';
import cloneDeep from 'clone-deep';

const usePrevious = (value: any) => {
    const cloned = cloneDeep(value)
    const ref = useRef();
    useEffect(() => {
        ref.current = cloned;
    });
    return ref.current;
}

export default usePrevious
