# InstapyGUI on Digital Ocean

need an digital ocean account ? [click here](https://m.do.co/c/be9ec19b28c1) to use our referral link and get 100$ for free

- create a 5 dollar droplet
    - cheapest one
    - choose 'Ubuntu 18.10' as distribution
- wait for the droplet to be created

### configure the firewall

- click the 3 dots for more options on your droplet
    - click 'Add a Domain'
- change the tab to 'Firewalls'
- click 'Create Firewall'

- on section 'Inbound Rules' add a new rule
    - choose 'http' in the dropdown menu

- on section 'Apply to Droplets' choose your new droplet
- click 'Create Firewall'

### install instapy-gui

- login to your droplet via ssh or browser console as root
- execute `snap install docker`
- clone docker-compose file
    - `git clone https://gist.github.com/db530748a68bdc150748f23b5a0ee072.git`
- rename the directory
    - `mv db530748a68bdc150748f23b5a0ee072 instapy-gui`

### start the gui

- go to instapy-gui directory
    - `cd ~/instapy-gui`
- execute `docker-compose up -d`
- wait until you see `instapy excited with code 0` in the console
    - this might take a while on the first start
- visit your droplet ip in the browser to see the gui

