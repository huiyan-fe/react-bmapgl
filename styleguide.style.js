module.exports.styles = {
  ComponentsList: {
    item: {
      '& a': {
        cursor: 'auto',
        color: '#333 !important',
      },
      cursor: 'auto',
      fontSize: '18px',
      margin: '12px 0'
    },
    isChild: {
      '& a:hover': {
        cursor: 'pointer',
        color: '#6E93DE !important',
      },
      cursor: 'pointer',
      fontSize: '15px',
      margin: '8px 0' 
    },
    isSelected: {
      '& a': {
        color: '#5E87DB !important',
      },
    }
  },
  SectionHeading: {
    wrapper: {
      margin: '2em 0',
    },
    sectionName: {
      '&:hover, &:active': {
        textDecoration: 'none',
        borderBottom: '2px solid #5479C4',
      },
    },
  },
  Table: {
    cellHeading: {
      minWidth: '150px'
    }
  },
  Name: {
    name: {
      fontWeight: 'bold'
    },
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
    },
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
}

module.exports.theme = {
  sidebarWidth: 300,
  font: ['PingFangSC-Regular', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'Helvetica', 'sans-serif'],
  fontSize: {
    base: 15,
    h1: 36,
    h2: 28,
    h3: 22,
    h4: 18,
    h5: 16,
    h6: 16,
    small: 13,
    text: 16,
  },
  color: {
    base: '#333',
    baseBackground: '#fff',
    border: '#e8e8e8',
    codeBackground: '#f5f5f5',
    error: '#FF7A2A',
    light: '#767676',
    lightest: '#ccc',
    link: '#5E87DB',
    linkHover: '#6E93DE',
    ribbonBackground: '#5E87DB',
    ribbonText: '#fff',
    sidebarBackground: '#f5f5f5',
    name: '#415E99',
    type: '#929292',
  },
}
