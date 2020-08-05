module.exports.styles = {
  SectionHeading: {
    wrapper: {
      margin: '2em 0',
    },
    sectionName: {
      '&:hover, &:active': {
        textDecoration: 'none',
        borderBottom: '2px solid #ff6044',
      },
    },
  },
  Type: {
    type: {
      width: '145px',
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 'bold',
    },
  },
  ComponentsList: {
    item: {
      '& a': {
        cursor: 'pointer',
        color: '#525252 !important',
      },
      '& a:hover, & a:active': {
        color: '#ff6044 !important',
      },
    },
  },
}

module.exports.theme = {
  sidebarWidth: 284,
  fontSize: {
    base: 15,
    h1: 33,
    h2: 27,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 16,
    small: 13,
    text: 15,
  },
  color: {
    base: '#333',
    baseBackground: '#fff',
    border: '#e8e8e8',
    codeBackground: '#f5f5f5',
    error: '#c00',
    light: '#767676',
    lightest: '#ccc',
    link: '#f6412d',
    linkHover: '#ff735d',
    ribbonBackground: '#f6412d',
    ribbonText: '#fff',
    sidebarBackground: '#f5f5f5',
    name: '#f92672',
    type: '#929292',
  },
}
