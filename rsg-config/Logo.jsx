import React from 'react';
import Styled from 'rsg-components/Styled';
import logo from './logo.ico';
import pkg from '../package.json';

const styles = theme => {
    const {fontFamily, color} = theme;
    return {
        logo: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 0,
            fontFamily: fontFamily.base,
            fontWeight: 'normal',
            color: color.base
        },
        image: {
            width: '4em',
            marginBottom: '1em'
        },
        version: {
            marginTop: '0.2em',
            color: color.light
        }
    };
};

export function LogoRenderer({classes, children}) {
    return (
        <h1 className={classes.logo}>
            <img src={logo} className={classes.image} />
            {children}
            <span className={classes.version}>({pkg.version})</span>
        </h1>
    );
}

export default Styled(styles)(LogoRenderer)
