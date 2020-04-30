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
        sh '/usr/local/bin/yarn install'
      }
    }
     
    stage('Running Tests') {
      steps {
        echo '######################'              
        echo 'Running tests ...'          
        echo '######################'        
        catchError(buildResult: 'SUCCESS', stageResult: 'failed') {       
          sh '/usr/local/bin/yarn test'
        }
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
