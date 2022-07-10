import crypto from 'crypto'

export const getSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}

export const hashPassword = (password: string, salt: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex')
  return hash
}
