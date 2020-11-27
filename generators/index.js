const Generator = require('yeoman-generator');
const yosay = require("yosay");
const chalk = require("chalk");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('babel');
  }
  async prompting() {
    this.log(
      yosay(
        `Welcome to the divine ${chalk.red(
          "generator-react-kit"
        )} generator!`
      )
    );
    try {
      const answers = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: 'react-app'
        },
        {
          type: 'input',
          name: 'title',
          message: 'Website title:',
          default: 'React App'
        },
        {
          type: 'input',
          name: 'desc',
          message: 'Describe your project:',
          default: ''
        },
        {
          type: 'input',
          name: 'author',
          message: 'Author:',
          default: ''
        }
      ])
      this.answers = answers;
    } catch (err) {
      this.log('Failed to generate. Please retry!')
    }
  }
  writing() {
    this.log(`Destination Path: ${this.destinationPath()}`)
    // 这里有个 bug，如果直接 copyTpl 所有的文件会报 ejs 解析的错误
    // 猜测是其他图片文件导致的，所以先 copy 所有的，再单独替换 package.json
    this.fs.copy(
      this.templatePath(),
      this.destinationPath(`./${this.answers.name}`)
    );
    this.fs.copyTpl(
      this.templatePath('./package.json'),
      this.destinationPath(`./${this.answers.name}/package.json`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('./public/index.html'),
      this.destinationPath(`./${this.answers.name}/public/index.html`),
      this.answers
    );
  }
  end() {
    const { spawn, execSync } = require('child_process');
    try {
      process.chdir(this.answers.name);
      execSync('git init');
      const child = spawn(
        "yarn",
        ["install"],
        {
          stdio: "inherit"
        }
      );
      child.on("error", () => {
        console.log(
          `Failed to install. You should install by yourself: ${chalk.yellow(
            `yarn install`
          )}`
        );
      });
    } catch (err) {
      console.error(err)
    }
  }
}