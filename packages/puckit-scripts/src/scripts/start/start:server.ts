import webpack, { Stats } from 'webpack'
import { clearConsole } from '@puckit/dev-utils'

import getSettings from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.server.config'
import createCompiler from '../../config/etc/createCompiler'
import checkChildProcess from '../../config/helpers/checkChildProcess'
import {
  printLink, concatUrl, printSuccessMsg, getCompilingMessage,
  printDevServer, printCompiledWithWarnings, printFailedToCompile,
  printPortWasOccupied,
} from '../../config/etc/messages'
import { ForkMessages, LinkTypes, MessageTags } from '../../config/constants'
import loadPuckitConfig from '../../config/etc/loadPuckitConfig'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const { PROTOCOL, HOST, SERVER_PORT } = getSettings()
const isChildProcess = checkChildProcess()
const printCompiling = getCompilingMessage(MessageTags.SERVER)

function onOccupied(port: number): void {
  printPortWasOccupied(MessageTags.SERVER, port)
}

printDevServer()

choosePort(HOST, SERVER_PORT, onOccupied).then((currPort) => {
  if (currPort === null) {
    return
  }

  process.on('unhandledRejection', (err: Error) => {
    clearConsole()
    printFailedToCompile(MessageTags.SERVER)
    throw err
  })

  const puckitConfig = loadPuckitConfig()
  const {
    server: modifyServerConfig = (config: object) => config,
  } = puckitConfig.modifyWebpackConfig || {}

  const webpackConfig = configFactory(currPort)
  modifyServerConfig(webpackConfig)

  const callback = (err?: Error, stats?: Stats): void => {
    if (err || stats?.hasErrors()) {
      clearConsole()
      printFailedToCompile(MessageTags.SERVER)
      const compilationErr = stats?.compilation.errors[0] || { message: undefined }
      console.log(err || compilationErr.message || compilationErr)
      return
    }

    if (isChildProcess) {
      process.send?.(ForkMessages.SERVER_SUCCESS)
      return
    }

    printSuccessMsg(MessageTags.SERVER)
    printLink(LinkTypes.SERVER, concatUrl(PROTOCOL, HOST, currPort))
  }

  createCompiler({
    webpack,
    config: webpackConfig,
    callback,
    onInvalid: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.SERVER_COMPILING)
        return
      }
      clearConsole()
      printCompiling.start()
    },
    onAfterCompile: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.SERVER_AFTER_COMPILING)
        return
      }
      printCompiling.stop()
    },
    onFailed: () => printFailedToCompile(MessageTags.SERVER),
    onWarning: () => printCompiledWithWarnings(MessageTags.SERVER),
  })
})
