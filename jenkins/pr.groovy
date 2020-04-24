pipeline {
  agent any
    
  tools {nodejs "SparkJS"}
    
  stages {

    stage('disable CFR') {
      import jenkins.model.Jenkins

      def instance = Jenkins.instance
      instance.setCrumbIssuer(null)      
    }
        
    stage('Cloning Git Repo') {
      steps {
        git 'https://github.com/ToniNichev/projects-sparkjs.git'
      }
    }
    stage('Install dependencies') {
      steps {
        echo '######################'              
        echo 'Building...'       
        echo '######################'                      
        sh '/usr/local/bin/yarn install'
      }
    }
     
    stage('Running Tests') {
      steps {
        echo '######################'              
        echo 'Running tests ...'          
        echo '######################'               
         sh '/usr/local/bin/yarn test'
      }
    }      
  }

  post { 
      always { 
          echo 'Starting server ...'
          sh '/usr/local/bin/yarn clean; /usr/local/bin/yarn build-prod; /usr/local/bin/yarn build-prod-ssr;'
          sh '/usr/local/bin/pm2 start ./server-build/server-bundle.js -f'
      }
  }  
}
