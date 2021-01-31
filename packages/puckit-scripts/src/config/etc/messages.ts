import {
  boldText, clearConsole, MessageTypes, printMessage,
  printMessageWithSpinner, Spinner,
} from '@puckit/dev-utils'

import { LinkTypes, MessageTags } from '../constants'
import { appPath } from '../paths'

export const printPortWasOccupied = (tag: MessageTags, defaultPort: string | number): void => {
  printMessage(MessageTypes.ERR, `Port ${defaultPort} was occupied`, tag)
}

export const printWds = (): void => {
  printMessage(MessageTypes.INFO, 'Starting webpack-dev-server', MessageTags.APP)
}

export const printDevServer = (): void => {
  printMessage(MessageTypes.INFO, 'Starting development server', MessageTags.SERVER)
}

export const printFailedToCompile = (tag: MessageTags): void => {
  printMessage(MessageTypes.ERR, 'Failed to compile', tag)
}

export const getCompilingMessage = (tag: MessageTags): Spinner => printMessageWithSpinner(MessageTypes.INFO, 'Compiling...', tag)

export const printCompilingSuccess = (tag: MessageTags): void => {
  printMessage(MessageTypes.DONE, 'Compiled successfully!', tag)
}

export const printCompiledWithWarnings = (tag: MessageTags): void => {
  printMessage(MessageTypes.WARN, 'Compiled with warnings', tag)
}

const appName = require(`${appPath}/package.json`).name

export const printSuccessMsg = (tag: MessageTags): void => {
  clearConsole()
  printCompilingSuccess(tag)
  printMessage(MessageTypes.MAIN, `\nYou can now view ${boldText(appName)} in the browser\n`)
}

export const printLink = (
  type: LinkTypes, protocol: string, host: string, port: string | number,
): void => (
  printMessage(MessageTypes.MAIN, `${boldText(type)}: ${protocol}://${host}:${boldText(port)}`)
)

export const getWaitingWebpackMessage = (): Spinner => printMessageWithSpinner(MessageTypes.INFO, 'Waiting webpack output', MessageTags.PUCKIT)

export const printRemoveFiles = (directoryPath: string): void => {
  printMessage(MessageTypes.INFO, `Removing files from directory "${directoryPath}"`, MessageTags.PUCKIT)
}

export const printSspArgument = (): void => {
  printMessage(MessageTypes.ERR, 'Argument must be a string', MessageTags.START_SERVER_PLUGIN)
}

export const printSspEntryNameNotFound = (allAssetsNames: string[]): void => {
  printMessage(MessageTypes.ERR, `Entry name not found. Try one of: ${allAssetsNames.join(' ')}`, MessageTags.START_SERVER_PLUGIN)
}

export const printSspError = (): void => {
  printMessage(MessageTypes.ERR, 'Error', MessageTags.START_SERVER_PLUGIN)
}