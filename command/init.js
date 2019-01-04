const chalk = require('chalk')
const fs = require('fs')
const co = require('co')
const prompt = require('co-prompt')
const exec = require('child_process').exec

module.exports = () => {
    co(function *() {
        // 分步接收用户输入的参数
        let projectName = yield prompt('Project name: [default: djzy-vue]')
        projectName = projectName || 'djzy-vue'
        console.log(chalk.green('\n project name is ' + projectName)) 
        let description = yield prompt('description: [default: This is a vue-based project]')
        description = description || 'This is a vue-based project'
        console.log(chalk.green('\n description is '+ `"${description}"`))
        let isVuex = yield prompt('项目中是否启用Vuex: yes/no [default or other: no]')
        let vuex = isVuex === ('yes' || 'y') ? 'open' : 'close'
        console.log(chalk.green('\n vuex is ' + vuex)) 
        let gitUrl = isVuex == 'open' ? 'https://github.com/xuweikang/djzy-vue-cli-with-vuex.git' : 'https://github.com/xuweikang/djzy-vue-cli-general.git' 

        let proNameGit = isVuex == 'open' ? 'djzy-vue-cli-with-vuex' : 'djzy-vue-cli-general'
        //git相关
        let cmdStr = `git clone ${gitUrl} && mv ${proNameGit} ${projectName} `
        console.log(chalk.white('\n Start generating...'))

        exec(cmdStr, (error, stdout, stderr) => {
            if (error) {
              console.log(error)
              process.exit()
            }
            console.log(chalk.green('\n √ Generation completed!'))
            console.log(chalk.green('\n Start init package.json...'))
            let packageJSON = JSON.parse(fs.readFileSync(`${projectName}/package.json`))
            packageJSON.name = projectName
            packageJSON.description = description
            fs.writeFile(`${projectName}/package.json`, JSON.stringify(packageJSON), 'utf-8', (err) => {
                if (err) console.log(err)
                console.log(chalk.green('package.json init successful!'))
                console.log(`\n cd ${projectName} && npm install \n`)
                process.exit()
            })
          })
    })
}