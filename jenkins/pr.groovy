
properties([pipelineTriggers([githubPush()])])

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
          sh 'yarn stop'
          sh 'yarn start'
      }
  }  
}
