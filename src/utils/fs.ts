import {stat, mkdir, unlink,rmdir } from 'fs';
import { promisify } from 'util'

export const statP = promisify(stat)
export const mkdirP = promisify(mkdir)
export const  rmdirP = promisify(rmdir)
export const  unlinkP = promisify(unlink)