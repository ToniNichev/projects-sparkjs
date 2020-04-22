pipeline {
  agent any
    
  tools {nodejs "SparkJS"}
    
  stages {
        
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
        sh 'yarn install'
      }
    }
     
    stage('Running Tests') {
      steps {
        echo '######################'              
        echo 'Running tests ...'          
        echo '######################'               
         sh 'yarn test'
      }
    }      
  }

  post { 
      always { 
          echo 'Starting server ...'
          sh 'yarn clean; yarn build-prod; yarn build-prod-ssr;'
          sh 'pm2 start ./server-build/server-bundle.js'
      }
  }  
}
