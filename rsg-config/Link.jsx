import React, {useState, useEffect} from 'react';
import Styled from 'rsg-components/Styled';
import DefaultLinkRenderer from 'react-styleguidist/lib/client/rsg-components/Link/LinkRenderer';

const styles = ({color}) => ({
    link: {
        '&, &:link, &:visited': {
            fontSize: 'inherit',
            color: color.link,
            textDecoration: 'none'
        },
        '&:hover, &:active': {
            isolate: false,
            color: color.linkHover,
            cursor: 'pointer'
        }
    }
});

export function LinkRenderer(props) {
    const [target, setTarget] = useState(props.target);

    const updateTarget = () => {
        if (/^http/.test(props.href) && target !== '_blank') {
            setTarget('_blank');
        }
    }

    function listener(e) {
        if (/\.baidu\.com/.test(e.origin) && e.data) {
            const data = e.data;
            if (data === 'lbsyun_iframe') {
                updateTarget();
            }
        }
    }

    useEffect(() => {
        // window.addEventListener('message', listener, false);
        updateTarget();
        return () => {
            // window.removeEventListener('message', listener);
        }
    }, []);

    return (
        <DefaultLinkRenderer {...props} target={target} />
    );
}

export default Styled(styles)(LinkRenderer);
