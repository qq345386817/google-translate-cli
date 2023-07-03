// puppeteer-extra 是 Puppeteer 的轻量级包装器
import puppeteer from 'puppeteer'
import { Command, Option } from 'commander'

const program = new Command()

program
  .addOption(new Option('-f, --from <type>', 'from language').default('en'))
  .addOption(new Option('-t, --to <type>', 'to language').default('zh-CN'))

program
  .requiredOption('-te, --text <string>', 'text')

program.parse()

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
  })
  const page = await browser.newPage()
  
  const opts = program.opts()
  // console.log(opts)
  const text = encodeURI(opts.text)

  let url = `https://translate.google.com/?sl=${opts.from}&tl=${opts.to}&text=${text}&op=translate`
  await page.goto(
    url, {
    waitUntil: 'networkidle0'
  })

  const value = await page.evaluate(() => {
    const input = document.getElementsByClassName('ryNqvb')[0]
    return input.innerHTML
  })
  console.log(value)

  await delay(100)

  await browser.close()
})()
