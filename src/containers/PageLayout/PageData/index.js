export default {
  '/about' : {
    template: "Html",    
    layout: [ 
      {
        span: 12,
        components: [
          {
            name: "Header"
          }
        ]
      },
      {
        span: 12,
        components:[
          {
            name: "About"
          }
        ] 
      }         
    ]    
  },
  '/home' : {
    template: "Html",              
    layout: [ 
      {
        span: 12,
        components: [
          {
            name: "Header"
          }
        ]
      },
      {
        span: 12,
        components:[
          {
            name: "Home"
          }
        ] 
      },        
    ]
  },
  '/greetings' : {
    template: "Html",    
    layout: [ 
      {
        span: 12,        
        components: [
          {
            name: "Header"
          }
        ]
      },
      {
        span: 12,
        components:[
          {
            name: "Greetings"
          }
        ] 
      },        
    ]
  },
  '/other-template' : {
    template: "OtherHtml",      
    layout: [ 
      {
        span: 12,
        components:[
          {
            name: "Greetings"
          }
        ] 
      },        
    ]
}    
}
