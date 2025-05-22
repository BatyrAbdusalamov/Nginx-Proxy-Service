const ServicesUrl= [ "http://localhost:8000/auth", "http://localhost:8000/app"  ];

this.window.onload = function() {
    // Build a system
    let url = this.window.location.search.match(/url=([^&]+)/);
    if (url && url.length > 1) {
      url = decodeURIComponent(url[1]);
    } else {
      url = this.window.location.origin;
    }
    let options = {
    "swaggerDoc": {
      "openapi": "3.0.0",
      "paths": {},
      "info": {
        "title": "API Services",
        "description": "The API description services: ",
        "version": "1.0",
        "contact": {}
      },
      "tags": [],
      "servers": [],
      "components": {
        "schemas": {}
      }
    },
    "customOptions": {}
    };
    ServicesUrl.map((url) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${url}/swagger/api/json`, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      try {
        xhr.send();
      const Options = JSON.parse(xhr.response);
      if( Options?.components?.schemas && Options?.paths && xhr.status === 200){
        options.swaggerDoc.info.description = options.swaggerDoc.info.description + Options.info.title + ", ";
        options.swaggerDoc.paths = { ...options.swaggerDoc.paths, ...Options.paths };
        options.swaggerDoc.components.schemas = { ...options.swaggerDoc.components.schemas, ...Options.components.schemas };
      }
      return null;
    } catch (error) {
      return null;
    }
    });
    url = options.swaggerUrl || url
    let urls = options.swaggerUrls
    let customOptions = options.customOptions
    let spec1 = options.swaggerDoc
    let swaggerOptions = {
      spec: spec1,
      url: url,
      urls: urls,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    }
    for (let attrname in customOptions) {
      swaggerOptions[attrname] = customOptions[attrname];
    }
    let ui = SwaggerUIBundle(swaggerOptions)
  
    if (customOptions.initOAuth) {
      ui.initOAuth(customOptions.initOAuth)
    }
  
    if (customOptions.authAction) {
      ui.authActions.authorize(customOptions.authAction)
    }
    
    this.window.ui = ui
  };
  