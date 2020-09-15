import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';

const styles = theme => {
    const {color, space, fontSize, fontFamily} = theme;
    return {
        root: {
            position: 'fixed',
            top: 0,
            right: 0,
            width: 149,
            height: 149,
            zIndex: 999
        },
        link: {
            fontFamily: fontFamily.base,
            position: 'relative',
            right: -37,
            top: -22,
            display: 'block',
            width: 190,
            padding: [[space[0], space[2]]],
            textAlign: 'center',
            color: color.ribbonText,
            fontSize: fontSize.base,
            background: color.ribbonBackground,
            textDecoration: 'none',
            textShadow: [[0, '-1px', 0, 'rgba(0,0,0,.15)']],
            transformOrigin: [[0, 0]],
            transform: 'rotate(45deg)',
            cursor: 'pointer'
        }
    };
};

export function RibbonRenderer(props) {
    var {classes, url, text} = props;
    return (
        <footer className={classes.root}>
            <a href={url} className={classes.link} target="_blank">{text}</a>
        </footer>
    )
}

RibbonRenderer.defaultProps = {
    text: 'Fork me on GitHub'
};

RibbonRenderer.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
    url: PropTypes.string.isRequired,
    text: PropTypes.string
};

export default Styled(styles)(RibbonRenderer);
