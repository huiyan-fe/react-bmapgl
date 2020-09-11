module.exports = {
    ComponentsList: {
        item: {
            '& a': {
                cursor: 'default !important',
                color: '#333 !important',
            },
            fontSize: '14px',
        },
        heading: {
            display: 'block',
            marginRight: '10px !important',
            padding: '10px 4px !important',
            background: '#eceff0 !important',
            pointerEvents: 'none !important',
        },
        isChild: {
            '& a:hover': {
                cursor: 'pointer !important',
                color: '#6E93DE !important',
            },
            fontSize: '15px',
            margin: '8px 0'
        },
        isSelected: {
            '& a': {
                color: '#5E87DB !important',
            }
        },
    },
    SectionHeading: {
        wrapper: {
            margin: '2em 0'
        },
        sectionName: {
            '&:hover, &:active': {
                textDecoration: 'none',
                borderBottom: '2px solid #5479C4'
            }
        }
    },
    Table: {
        cellHeading: {
            minWidth: '150px'
        }
    },
    Name: {
        name: {
            fontWeight: 'bold'
        }
    },
    Type: {
        type: {
            width: '240px',
            display: 'inline-block',
            fontSize: '12px'
        }
    },
    Editor: {
        root: {
            lineHeight: '1.6'
        }
    },
    Code: {
        code: {
            background: '#f5f5f5',
            borderRadius: '6px',
            padding: '0.2em 0.3em',
            margin: '0 2px',
            fontSize: '85%',
            fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace'
        }
    }
};
