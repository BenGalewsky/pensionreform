<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 526ce7dfdd65d41e98865bc72dfde003697a8123
import csv

# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'retiree':0, 'totContributions':0, 'totYears':0} for k in range(101)]

with open('Melton FOIA GARS inactives 51315.csv', 'rb') as csvfile:
    inactivesReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in inactivesReader:
        if row['Name']=='':
            continue
        else:
            # Find the age in years in the field containing years and months
            age = int(str.split(row['Current Age'], 'yrs')[0])
    
            # Accumulate number of members in this age bucket
            pop[age]['count'] += 1
    
            # Keep track of percentage by teir
            if row['Tier'] == '1':
                pop[age]['t1'] += 1
            else:
                pop[age]['t2'] += 1
    
            # By gender
            if row['Gender'] == 'Male':
                pop[age]['male']+=1
            else:
                pop[age]['female']+=1
<<<<<<< HEAD
                
            contributions = float(row['Total Contributions'].replace(',', ''))
            pop[age]['totContributions'] += contributions
            
            pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ','.join(['Age','Count', 'Avg Contributions', 'Avg Years of Service', 'Pct Male', 'Pct T1'])
for i in range(len(pop)):
    count = pop[i]['count']
    avgContrib = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgContrib = pop[i]['totContributions'] / float(count)
        pctMale = pop[i]['male'] /  float(count)
        pctT1 = pop[i]['t1'] / float(count)
        avgYears = pop[i]['totYears'] / float(count)

    rslt = [i, count, avgContrib, avgYears, pctMale, pctT1]     
    print ','.join(str(x) for x in rslt)
=======
                
            contributions = float(row['Total Contributions'].replace(',', ''))
            pop[age]['totContributions'] += contributions
            
            pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ','.join(['Age','Count', 'Avg Contributions', 'Avg Years of Service', 'Pct Male', 'Pct T1'])
for i in range(len(pop)):
    count = pop[i]['count']
    avgContrib = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgContrib = pop[i]['totContributions'] / float(count)
        pctMale = pop[i]['male'] /  float(count)
        pctT1 = pop[i]['t1'] / float(count)
        avgYears = pop[i]['totYears'] / float(count)

    rslt = [i, count, avgContrib, avgYears, pctMale, pctT1]     
    print ','.join(str(x) for x in rslt)
=======



<!DOCTYPE html>
<html lang="en" class=" is-copy-enabled">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta name="viewport" content="width=1020">
    
    
    <title>pensionreform/PopulationGen - Inactives.py at master · BenGalewsky/pensionreform</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="BenGalewsky/pensionreform" name="twitter:title" /><meta content="pensionreform - Pension Reform in Illinois" name="twitter:description" /><meta content="https://avatars3.githubusercontent.com/u/8229875?v=3&amp;s=400" name="twitter:image:src" />
      <meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars3.githubusercontent.com/u/8229875?v=3&amp;s=400" property="og:image" /><meta content="BenGalewsky/pensionreform" property="og:title" /><meta content="https://github.com/BenGalewsky/pensionreform" property="og:url" /><meta content="pensionreform - Pension Reform in Illinois" property="og:description" />
      <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">
    <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">
    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="web-socket" href="wss://live.github.com/_sockets/OTAyNDc5OTowZWI1OWRlNDY0YzA0YWZkOGRhYWFlYzg2OWI4ZmM5MDphMzBiZmFhYWJkZjQ2ZTc5Nzk1NjRlZWNjZDk3NDk3MjU1MGY0NjQzNWQ0YWMyYzk0ZDcxMjQ3OTg3ZTFjMTdk--39ee3b4ed3b4bb0b28aa16236c384445d36d6e66">
    <meta name="pjax-timeout" content="1000">
    <link rel="sudo-modal" href="/sessions/sudo_modal">

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>

    <meta name="google-site-verification" content="KT5gs8h0wvaagLKAVWq8bbeNwnZZK1r1XQysX3xurLU">
    <meta name="google-analytics" content="UA-3769691-2">

<meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="CDB20B41:1164:1ADCE0CA:561488A6" name="octolytics-dimension-request_id" /><meta content="9024799" name="octolytics-actor-id" /><meta content="pwilczewski" name="octolytics-actor-login" /><meta content="ce6218f4b8c4681aa44fd5da36c6097df7e6d954ae4299bcadc01c21a8f4ae32" name="octolytics-actor-hash" />

<meta content="Rails, view, blob#show" data-pjax-transient="true" name="analytics-event" />


  <meta class="js-ga-set" name="dimension1" content="Logged In">
    <meta class="js-ga-set" name="dimension4" content="Current repo nav">




    <meta name="is-dotcom" content="true">
        <meta name="hostname" content="github.com">
    <meta name="user-login" content="pwilczewski">

      <link rel="mask-icon" href="https://assets-cdn.github.com/pinned-octocat.svg" color="#4078c0">
      <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">

      <!-- </textarea> --><!-- '"` --><meta content="authenticity_token" name="csrf-param" />
<meta content="3W6zw7Yyqzc5GQIkUmKGW1XXVJyxBHkDK5vNk9TJNPT0aiuuIWdmUvegovFjWNL0JznzkPK0ufWidOtnLuZCIw==" name="csrf-token" />
    <meta content="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" name="form-nonce" />

    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github-923625b9d2e4b6f88c21f82fc71af24018eb1a9fbc8fc1151778e54d3c351454.css" integrity="sha256-kjYludLktviMIfgvxxryQBjrGp+8j8EVF3jlTTw1FFQ=" media="all" rel="stylesheet" />
    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github2-9ad3aee49df1512bdaf35b062454a5d482df8542ac4ac78ba548d26d7806d58b.css" integrity="sha256-mtOu5J3xUSva81sGJFSl1ILfhUKsSseLpUjSbXgG1Ys=" media="all" rel="stylesheet" />
    
    
    


    <meta http-equiv="x-pjax-version" content="19d024c0fced31f28fd27be23478af50">

      
  <meta name="description" content="pensionreform - Pension Reform in Illinois">
  <meta name="go-import" content="github.com/BenGalewsky/pensionreform git https://github.com/BenGalewsky/pensionreform.git">

  <meta content="8229875" name="octolytics-dimension-user_id" /><meta content="BenGalewsky" name="octolytics-dimension-user_login" /><meta content="24392705" name="octolytics-dimension-repository_id" /><meta content="BenGalewsky/pensionreform" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="24392705" name="octolytics-dimension-repository_network_root_id" /><meta content="BenGalewsky/pensionreform" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/BenGalewsky/pensionreform/commits/master.atom" rel="alternate" title="Recent Commits to pensionreform:master" type="application/atom+xml">

  </head>


  <body class="logged_in   env-production windows vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>

    
    
    



      <div class="header header-logged-in true" role="banner">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/" data-hotkey="g d" aria-label="Homepage" data-ga-click="Header, go to dashboard, icon:logo">
  <span class="mega-octicon octicon-mark-github"></span>
</a>


      <div class="site-search repo-scope js-site-search" role="search">
          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/BenGalewsky/pensionreform/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/BenGalewsky/pensionreform/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
  <label class="js-chromeless-input-container form-control">
    <div class="scope-badge">This repository</div>
    <input type="text"
      class="js-site-search-focus js-site-search-field is-clearable chromeless-input"
      data-hotkey="s"
      name="q"
      placeholder="Search"
      aria-label="Search this repository"
      data-global-scope-placeholder="Search GitHub"
      data-repo-scope-placeholder="Search"
      tabindex="1"
      autocapitalize="off">
  </label>
</form>
      </div>

      <ul class="header-nav left" role="navigation">
        <li class="header-nav-item">
          <a href="/pulls" class="js-selected-navigation-item header-nav-link" data-ga-click="Header, click, Nav menu - item:pulls context:user" data-hotkey="g p" data-selected-links="/pulls /pulls/assigned /pulls/mentioned /pulls">
            Pull requests
</a>        </li>
        <li class="header-nav-item">
          <a href="/issues" class="js-selected-navigation-item header-nav-link" data-ga-click="Header, click, Nav menu - item:issues context:user" data-hotkey="g i" data-selected-links="/issues /issues/assigned /issues/mentioned /issues">
            Issues
</a>        </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="https://gist.github.com/" data-ga-click="Header, go to gist, text:gist">Gist</a>
          </li>
      </ul>

    
<ul class="header-nav user-nav right" id="user-links">
  <li class="header-nav-item">
      <span class="js-socket-channel js-updatable-content"
        data-channel="notification-changed:pwilczewski"
        data-url="/notifications/header">
      <a href="/notifications" aria-label="You have unread notifications" class="header-nav-link notification-indicator tooltipped tooltipped-s" data-ga-click="Header, go to notifications, icon:unread" data-hotkey="g n">
          <span class="mail-status unread"></span>
          <span class="octicon octicon-bell"></span>
</a>  </span>

  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link tooltipped tooltipped-s js-menu-target" href="/new"
       aria-label="Create new…"
       data-ga-click="Header, create new, icon:add">
      <span class="octicon octicon-plus left"></span>
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <ul class="dropdown-menu dropdown-menu-sw">
        
<a class="dropdown-item" href="/new" data-ga-click="Header, create new repository">
  New repository
</a>


  <a class="dropdown-item" href="/organizations/new" data-ga-click="Header, create new organization">
    New organization
  </a>



  <div class="dropdown-divider"></div>
  <div class="dropdown-header">
    <span title="BenGalewsky/pensionreform">This repository</span>
  </div>
    <a class="dropdown-item" href="/BenGalewsky/pensionreform/issues/new" data-ga-click="Header, create new issue">
      New issue
    </a>

      </ul>
    </div>
  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link name tooltipped tooltipped-s js-menu-target" href="/pwilczewski"
       aria-label="View profile and more"
       data-ga-click="Header, show menu, icon:avatar">
      <img alt="@pwilczewski" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/9024799?v=3&amp;s=40" width="20" />
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <div class="dropdown-menu  dropdown-menu-sw">
        <div class=" dropdown-header header-nav-current-user css-truncate">
            Signed in as <strong class="css-truncate-target">pwilczewski</strong>

        </div>


        <div class="dropdown-divider"></div>

          <a class="dropdown-item" href="/pwilczewski" data-ga-click="Header, go to profile, text:your profile">
            Your profile
          </a>
        <a class="dropdown-item" href="/stars" data-ga-click="Header, go to starred repos, text:your stars">
          Your stars
        </a>
        <a class="dropdown-item" href="/explore" data-ga-click="Header, go to explore, text:explore">
          Explore
        </a>
          <a class="dropdown-item" href="/integrations" data-ga-click="Header, go to integrations, text:integrations">
            Integrations
          </a>
        <a class="dropdown-item" href="https://help.github.com" data-ga-click="Header, go to help, text:help">
          Help
        </a>

          <div class="dropdown-divider"></div>

          <a class="dropdown-item" href="/settings/profile" data-ga-click="Header, go to settings, icon:settings">
            Settings
          </a>

          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/logout" class="logout-form" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="xcqje0k4BAmI/booUIxLvaGgciP/3IoXYJVrL/JhSPmn1yS3ChFg3T4MulddCdD+SiM6w5H6hfeHwQsSRwP/2A==" /></div>
            <button class="dropdown-item dropdown-signout" data-ga-click="Header, sign out, icon:logout">
              Sign out
            </button>
</form>
      </div>
    </div>
  </li>
</ul>


    
  </div>
</div>

      

      


    <div id="start-of-content" class="accessibility-aid"></div>

    <div id="js-flash-container">
</div>


    <div role="main" class="main-content">
        <div itemscope itemtype="http://schema.org/WebPage">
    <div class="pagehead repohead instapaper_ignore readability-menu">

      <div class="container">

        <div class="clearfix">
          

<ul class="pagehead-actions">

  <li>
      <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="w0xfIHegWHLxgvRfDb21mK8HTbfD3ei958swSjb6R1WOmL6DmHaDnhaVOMOGyC0NxJxSrXafVXJddKuzbARwow==" /></div>    <input id="repository_id" name="repository_id" type="hidden" value="24392705" />

      <div class="select-menu js-menu-container js-select-menu">
        <a href="/BenGalewsky/pensionreform/subscription"
          class="btn btn-sm btn-with-count select-menu-button js-menu-target" role="button" tabindex="0" aria-haspopup="true"
          data-ga-click="Repository, click Watch settings, action:blob#show">
          <span class="js-select-button">
            <span class="octicon octicon-eye"></span>
            Watch
          </span>
        </a>
        <a class="social-count js-social-count" href="/BenGalewsky/pensionreform/watchers">
          6
        </a>

        <div class="select-menu-modal-holder">
          <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-hidden="true">
            <div class="select-menu-header">
              <span class="select-menu-title">Notifications</span>
              <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
            </div>

            <div class="select-menu-list js-navigation-container" role="menu">

              <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                  <span class="select-menu-item-heading">Not watching</span>
                  <span class="description">Be notified when participating or @mentioned.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-eye"></span>
                    Watch
                  </span>
                </div>
              </div>

              <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                  <span class="select-menu-item-heading">Watching</span>
                  <span class="description">Be notified of all conversations.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-eye"></span>
                    Unwatch
                  </span>
                </div>
              </div>

              <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                <span class="select-menu-item-icon octicon octicon-check"></span>
                <div class="select-menu-item-text">
                  <input id="do_ignore" name="do" type="radio" value="ignore" />
                  <span class="select-menu-item-heading">Ignoring</span>
                  <span class="description">Never be notified.</span>
                  <span class="js-select-button-text hidden-select-button-text">
                    <span class="octicon octicon-mute"></span>
                    Stop ignoring
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
</form>
  </li>

  <li>
    
  <div class="js-toggler-container js-social-container starring-container on">

    <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/BenGalewsky/pensionreform/unstar" class="js-toggler-form starred js-unstar-button" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="hI28DRc32Co9jHEuSSKxlU6wlW33eWDBhJiwzonI34l5iTuwl4IfEujagifFDkrTMD8NBsWyJlMPYvT2BK4nwA==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Unstar this repository" title="Unstar BenGalewsky/pensionreform"
        data-ga-click="Repository, click unstar button, action:blob#show; text:Unstar">
        <span class="octicon octicon-star"></span>
        Unstar
      </button>
        <a class="social-count js-social-count" href="/BenGalewsky/pensionreform/stargazers">
          3
        </a>
</form>
    <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/BenGalewsky/pensionreform/star" class="js-toggler-form unstarred js-star-button" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="IP2Fa33+pMVQR2Taa+dJOYSFU68om8StoxWELlSemfOtQ0dUBFh9IuYqWUvHsxoi0ylpIGfcvdXPdOip5l4/ww==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Star this repository" title="Star BenGalewsky/pensionreform"
        data-ga-click="Repository, click star button, action:blob#show; text:Star">
        <span class="octicon octicon-star"></span>
        Star
      </button>
        <a class="social-count js-social-count" href="/BenGalewsky/pensionreform/stargazers">
          3
        </a>
</form>  </div>

  </li>

  <li>
          <a href="#fork-destination-box" class="btn btn-sm btn-with-count"
              title="Fork your own copy of BenGalewsky/pensionreform to your account"
              aria-label="Fork your own copy of BenGalewsky/pensionreform to your account"
              rel="facebox"
              data-ga-click="Repository, show fork modal, action:blob#show; text:Fork">
            <span class="octicon octicon-repo-forked"></span>
            Fork
          </a>

          <div id="fork-destination-box" style="display: none;">
            <h2 class="facebox-header" data-facebox-id="facebox-header">Where should we fork this repository?</h2>
            <include-fragment src=""
                class="js-fork-select-fragment fork-select-fragment"
                data-url="/BenGalewsky/pensionreform/fork?fragment=1">
              <img alt="Loading" height="64" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif" width="64" />
            </include-fragment>
          </div>

    <a href="/BenGalewsky/pensionreform/network" class="social-count">
      5
    </a>
  </li>
</ul>

          <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public ">
  <span class="mega-octicon octicon-repo"></span>
  <span class="author"><a href="/BenGalewsky" class="url fn" itemprop="url" rel="author"><span itemprop="title">BenGalewsky</span></a></span><!--
--><span class="path-divider">/</span><!--
--><strong><a href="/BenGalewsky/pensionreform" data-pjax="#js-repo-pjax-container">pensionreform</a></strong>

  <span class="page-context-loader">
    <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
  </span>

</h1>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline ">
        <div class="repository-sidebar clearfix">
          
<nav class="sunken-menu repo-nav js-repo-nav js-sidenav-container-pjax js-octicon-loaders"
     role="navigation"
     data-pjax="#js-repo-pjax-container"
     data-issue-count-url="/BenGalewsky/pensionreform/issues/counts">
  <ul class="sunken-menu-group">
    <li class="tooltipped tooltipped-w" aria-label="Code">
      <a href="/BenGalewsky/pensionreform" aria-label="Code" aria-selected="true" class="js-selected-navigation-item selected sunken-menu-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /BenGalewsky/pensionreform">
        <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>

      <li class="tooltipped tooltipped-w" aria-label="Issues">
        <a href="/BenGalewsky/pensionreform/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /BenGalewsky/pensionreform/issues">
          <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
          <span class="js-issue-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

    <li class="tooltipped tooltipped-w" aria-label="Pull requests">
      <a href="/BenGalewsky/pensionreform/pulls" aria-label="Pull requests" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g p" data-selected-links="repo_pulls /BenGalewsky/pensionreform/pulls">
          <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull requests</span>
          <span class="js-pull-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>

      <li class="tooltipped tooltipped-w" aria-label="Wiki">
        <a href="/BenGalewsky/pensionreform/wiki" aria-label="Wiki" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g w" data-selected-links="repo_wiki /BenGalewsky/pensionreform/wiki">
          <span class="octicon octicon-book"></span> <span class="full-word">Wiki</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
  </ul>
  <div class="sunken-menu-separator"></div>
  <ul class="sunken-menu-group">

    <li class="tooltipped tooltipped-w" aria-label="Pulse">
      <a href="/BenGalewsky/pensionreform/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-selected-links="pulse /BenGalewsky/pensionreform/pulse">
        <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>

    <li class="tooltipped tooltipped-w" aria-label="Graphs">
      <a href="/BenGalewsky/pensionreform/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-selected-links="repo_graphs repo_contributors /BenGalewsky/pensionreform/graphs">
        <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>
  </ul>


</nav>

            <div class="only-with-full-nav">
                
<div class="js-clone-url clone-url open"
  data-protocol-type="http">
  <h3 class="text-small"><span class="text-emphasized">HTTPS</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini text-small input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/BenGalewsky/pensionreform.git" readonly="readonly" aria-label="HTTPS clone URL">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="js-clone-url clone-url "
  data-protocol-type="ssh">
  <h3 class="text-small"><span class="text-emphasized">SSH</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini text-small input-monospace js-url-field js-zeroclipboard-target"
           value="git@github.com:BenGalewsky/pensionreform.git" readonly="readonly" aria-label="SSH clone URL">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="js-clone-url clone-url "
  data-protocol-type="subversion">
  <h3 class="text-small"><span class="text-emphasized">Subversion</span> checkout URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini text-small input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/BenGalewsky/pensionreform" readonly="readonly" aria-label="Subversion checkout URL">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>



<div class="clone-options text-small">You can clone with
  <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone" class="inline-form js-clone-selector-form is-enabled" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="NPHtykniSW4TK8gaetURhaHPp9ebKrjATJD1LVwvabAnwylyPDvGoOzr+QzOfcSK7dHRdlHSVvmYe4FYkDCZ9w==" /></div><button class="btn-link js-clone-selector" data-protocol="http" type="submit">HTTPS</button></form>, <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/users/set_protocol?protocol_selector=ssh&amp;protocol_type=clone" class="inline-form js-clone-selector-form is-enabled" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="axJsGf1gGD+0GSs5pkPNhppy054mF4GgLS/Z/TCftq2TOIsZsCX9BovtiQteLWPm+vZpWB3tSMk8KCeKom4y+w==" /></div><button class="btn-link js-clone-selector" data-protocol="ssh" type="submit">SSH</button></form>, or <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone" class="inline-form js-clone-selector-form is-enabled" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="bCAkb5M5hvJqQtV2jVPe6z022eXJv2cNn6Sm05WX5VxGZIUrQ2Cp6Th8fevwaeUXM2BKpi7+7k0SHGBejONuRQ==" /></div><button class="btn-link js-clone-selector" data-protocol="subversion" type="submit">Subversion</button></form>.
  <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <span class="octicon octicon-question"></span>
  </a>
</div>
  <a href="https://windows.github.com" class="btn btn-sm sidebar-button" title="Save BenGalewsky/pensionreform to your computer and use it in GitHub Desktop." aria-label="Save BenGalewsky/pensionreform to your computer and use it in GitHub Desktop.">
    <span class="octicon octicon-desktop-download"></span>
    Clone in Desktop
  </a>

              <a href="/BenGalewsky/pensionreform/archive/master.zip"
                 class="btn btn-sm sidebar-button"
                 aria-label="Download the contents of BenGalewsky/pensionreform as a zip file"
                 title="Download the contents of BenGalewsky/pensionreform as a zip file"
                 rel="nofollow">
                <span class="octicon octicon-cloud-download"></span>
                Download ZIP
              </a>
            </div>
        </div>
        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>

          

<a href="/BenGalewsky/pensionreform/blob/247f8bcbbafce49a51aa27ac2d59660a6d5dc6f1/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:dbc363a8048e4543d2061d76b2101ffe -->

  <div class="file-navigation js-zeroclipboard-container">
    
<div class="select-menu js-menu-container js-select-menu left">
  <span class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    title="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <i>Branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/BenGalewsky/pensionreform/blob/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="master">
                master
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

    <div class="btn-group right">
      <a href="/BenGalewsky/pensionreform/find/master"
            class="js-show-file-finder btn btn-sm empty-icon tooltipped tooltipped-nw"
            data-pjax
            data-hotkey="t"
            aria-label="Quickly jump between files">
        <span class="octicon octicon-list-unordered"></span>
      </a>
      <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </div>

    <div class="breadcrumb js-zeroclipboard-target">
      <span class="repo-root js-repo-root"><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/BenGalewsky/pensionreform" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">pensionreform</span></a></span></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/BenGalewsky/pensionreform/tree/master/src" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">src</span></a></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/BenGalewsky/pensionreform/tree/master/src/R" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">R</span></a></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/BenGalewsky/pensionreform/tree/master/src/R/pension-modeling" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">pension-modeling</span></a></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/BenGalewsky/pensionreform/tree/master/src/R/pension-modeling/CSVs" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">CSVs</span></a></span><span class="separator">/</span><strong class="final-path">PopulationGen - Inactives.py</strong>
    </div>
  </div>


  <div class="commit file-history-tease">
    <div class="file-history-tease-header">
        <img alt="" class="avatar" height="24" src="https://0.gravatar.com/avatar/6a8640114ff1d7aad1279209050fb225?d=https%3A%2F%2Fassets-cdn.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png&amp;r=x&amp;s=140" width="24" />
        <span class="author"><span>Ben</span></span>
        <time datetime="2015-09-29T18:34:36Z" is="relative-time">Sep 29, 2015</time>
        <div class="commit-title">
            <a href="/BenGalewsky/pensionreform/commit/247f8bcbbafce49a51aa27ac2d59660a6d5dc6f1" class="message" data-pjax="true" title="Added tracking of inactives">Added tracking of inactives</a>
        </div>
    </div>

    <div class="participation">
      <p class="quickstat">
        <a href="#blob_contributors_box" rel="facebox">
          <strong>0</strong>
           contributors
        </a>
      </p>
      
    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header" data-facebox-id="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list" data-facebox-id="facebox-description">
      </ul>
    </div>
  </div>

<div class="file">
  <div class="file-header">
  <div class="file-actions">

    <div class="btn-group">
      <a href="/BenGalewsky/pensionreform/raw/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="btn btn-sm " id="raw-url">Raw</a>
        <a href="/BenGalewsky/pensionreform/blame/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="btn btn-sm js-update-url-with-hash">Blame</a>
      <a href="/BenGalewsky/pensionreform/commits/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="btn btn-sm " rel="nofollow">History</a>
    </div>

      <a class="octicon-btn tooltipped tooltipped-nw"
         href="https://windows.github.com"
         aria-label="Open this file in GitHub Desktop"
         data-ga-click="Repository, open with desktop, type:windows">
          <span class="octicon octicon-device-desktop"></span>
      </a>

        <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/BenGalewsky/pensionreform/edit/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="inline-form js-update-url-with-hash" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="DqJoo0LGgQvRuGJR18DEN22DpgQ8hwsaZUll9yAysFdoDszZoHdqMVuAhs+2hCvKYdEbPsQbNhJ+V2frfSeKQQ==" /></div>
          <button class="octicon-btn tooltipped tooltipped-nw" type="submit"
            aria-label="Edit the file in your fork of this project" data-hotkey="e" data-disable-with>
            <span class="octicon octicon-pencil"></span>
          </button>
</form>        <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/BenGalewsky/pensionreform/delete/master/src/R/pension-modeling/CSVs/PopulationGen%20-%20Inactives.py" class="inline-form" data-form-nonce="4dd196bdf69eb1105fe1a10f4d4f98fa5dd2069c" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="mZ2hSmL5AHGKS7l+J1jaDdhD1tuPLUt+PXe+7mAcokgDDZTRo/VP3srBHedHqATbZ5s9PC89TserIsobT24UJw==" /></div>
          <button class="octicon-btn octicon-btn-danger tooltipped tooltipped-nw" type="submit"
            aria-label="Delete the file in your fork of this project" data-disable-with>
            <span class="octicon octicon-trashcan"></span>
          </button>
</form>  </div>

  <div class="file-info">
      53 lines (42 sloc)
      <span class="file-info-divider"></span>
    1.86 KB
  </div>
</div>

  

  <div class="blob-wrapper data type-python">
      <table class="highlight tab-size js-file-line-container" data-tab-size="8">
      <tr>
        <td id="L1" class="blob-num js-line-number" data-line-number="1"></td>
        <td id="LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-k">import</span> csv</td>
      </tr>
      <tr>
        <td id="L2" class="blob-num js-line-number" data-line-number="2"></td>
        <td id="LC2" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L3" class="blob-num js-line-number" data-line-number="3"></td>
        <td id="LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-c"># Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old</span></td>
      </tr>
      <tr>
        <td id="L4" class="blob-num js-line-number" data-line-number="4"></td>
        <td id="LC4" class="blob-code blob-code-inner js-file-line">pop <span class="pl-k">=</span> [{<span class="pl-s"><span class="pl-pds">&#39;</span>count<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>male<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>female<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>,<span class="pl-s"><span class="pl-pds">&#39;</span>t1<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>t2<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>retiree<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>totContributions<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>, <span class="pl-s"><span class="pl-pds">&#39;</span>totYears<span class="pl-pds">&#39;</span></span>:<span class="pl-c1">0</span>} <span class="pl-k">for</span> k <span class="pl-k">in</span> <span class="pl-c1">range</span>(<span class="pl-c1">101</span>)]</td>
      </tr>
      <tr>
        <td id="L5" class="blob-num js-line-number" data-line-number="5"></td>
        <td id="LC5" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L6" class="blob-num js-line-number" data-line-number="6"></td>
        <td id="LC6" class="blob-code blob-code-inner js-file-line"><span class="pl-k">with</span> <span class="pl-c1">open</span>(<span class="pl-s"><span class="pl-pds">&#39;</span>Melton FOIA GARS inactives 51315.csv<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span>rb<span class="pl-pds">&#39;</span></span>) <span class="pl-k">as</span> csvfile:</td>
      </tr>
      <tr>
        <td id="L7" class="blob-num js-line-number" data-line-number="7"></td>
        <td id="LC7" class="blob-code blob-code-inner js-file-line">    inactivesReader <span class="pl-k">=</span> csv.DictReader(csvfile, <span class="pl-smi">delimiter</span><span class="pl-k">=</span><span class="pl-s"><span class="pl-pds">&#39;</span>,<span class="pl-pds">&#39;</span></span>, <span class="pl-smi">quotechar</span><span class="pl-k">=</span><span class="pl-s"><span class="pl-pds">&#39;</span>&quot;<span class="pl-pds">&#39;</span></span>)</td>
      </tr>
      <tr>
        <td id="L8" class="blob-num js-line-number" data-line-number="8"></td>
        <td id="LC8" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">for</span> row <span class="pl-k">in</span> inactivesReader:</td>
      </tr>
      <tr>
        <td id="L9" class="blob-num js-line-number" data-line-number="9"></td>
        <td id="LC9" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">if</span> row[<span class="pl-s"><span class="pl-pds">&#39;</span>Name<span class="pl-pds">&#39;</span></span>]<span class="pl-k">==</span><span class="pl-s"><span class="pl-pds">&#39;</span><span class="pl-pds">&#39;</span></span>:</td>
      </tr>
      <tr>
        <td id="L10" class="blob-num js-line-number" data-line-number="10"></td>
        <td id="LC10" class="blob-code blob-code-inner js-file-line">            <span class="pl-k">continue</span></td>
      </tr>
      <tr>
        <td id="L11" class="blob-num js-line-number" data-line-number="11"></td>
        <td id="LC11" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">else</span>:</td>
      </tr>
      <tr>
        <td id="L12" class="blob-num js-line-number" data-line-number="12"></td>
        <td id="LC12" class="blob-code blob-code-inner js-file-line">            <span class="pl-c"># Find the age in years in the field containing years and months</span></td>
      </tr>
      <tr>
        <td id="L13" class="blob-num js-line-number" data-line-number="13"></td>
        <td id="LC13" class="blob-code blob-code-inner js-file-line">            age <span class="pl-k">=</span> <span class="pl-c1">int</span>(<span class="pl-c1">str</span>.split(row[<span class="pl-s"><span class="pl-pds">&#39;</span>Current Age<span class="pl-pds">&#39;</span></span>], <span class="pl-s"><span class="pl-pds">&#39;</span>yrs<span class="pl-pds">&#39;</span></span>)[<span class="pl-c1">0</span>])</td>
      </tr>
      <tr>
        <td id="L14" class="blob-num js-line-number" data-line-number="14"></td>
        <td id="LC14" class="blob-code blob-code-inner js-file-line">    </td>
      </tr>
      <tr>
        <td id="L15" class="blob-num js-line-number" data-line-number="15"></td>
        <td id="LC15" class="blob-code blob-code-inner js-file-line">            <span class="pl-c"># Accumulate number of members in this age bucket</span></td>
      </tr>
      <tr>
        <td id="L16" class="blob-num js-line-number" data-line-number="16"></td>
        <td id="LC16" class="blob-code blob-code-inner js-file-line">            pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>count<span class="pl-pds">&#39;</span></span>] <span class="pl-k">+=</span> <span class="pl-c1">1</span></td>
      </tr>
      <tr>
        <td id="L17" class="blob-num js-line-number" data-line-number="17"></td>
        <td id="LC17" class="blob-code blob-code-inner js-file-line">    </td>
      </tr>
      <tr>
        <td id="L18" class="blob-num js-line-number" data-line-number="18"></td>
        <td id="LC18" class="blob-code blob-code-inner js-file-line">            <span class="pl-c"># Keep track of percentage by teir</span></td>
      </tr>
      <tr>
        <td id="L19" class="blob-num js-line-number" data-line-number="19"></td>
        <td id="LC19" class="blob-code blob-code-inner js-file-line">            <span class="pl-k">if</span> row[<span class="pl-s"><span class="pl-pds">&#39;</span>Tier<span class="pl-pds">&#39;</span></span>] <span class="pl-k">==</span> <span class="pl-s"><span class="pl-pds">&#39;</span>1<span class="pl-pds">&#39;</span></span>:</td>
      </tr>
      <tr>
        <td id="L20" class="blob-num js-line-number" data-line-number="20"></td>
        <td id="LC20" class="blob-code blob-code-inner js-file-line">                pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>t1<span class="pl-pds">&#39;</span></span>] <span class="pl-k">+=</span> <span class="pl-c1">1</span></td>
      </tr>
      <tr>
        <td id="L21" class="blob-num js-line-number" data-line-number="21"></td>
        <td id="LC21" class="blob-code blob-code-inner js-file-line">            <span class="pl-k">else</span>:</td>
      </tr>
      <tr>
        <td id="L22" class="blob-num js-line-number" data-line-number="22"></td>
        <td id="LC22" class="blob-code blob-code-inner js-file-line">                pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>t2<span class="pl-pds">&#39;</span></span>] <span class="pl-k">+=</span> <span class="pl-c1">1</span></td>
      </tr>
      <tr>
        <td id="L23" class="blob-num js-line-number" data-line-number="23"></td>
        <td id="LC23" class="blob-code blob-code-inner js-file-line">    </td>
      </tr>
      <tr>
        <td id="L24" class="blob-num js-line-number" data-line-number="24"></td>
        <td id="LC24" class="blob-code blob-code-inner js-file-line">            <span class="pl-c"># By gender</span></td>
      </tr>
      <tr>
        <td id="L25" class="blob-num js-line-number" data-line-number="25"></td>
        <td id="LC25" class="blob-code blob-code-inner js-file-line">            <span class="pl-k">if</span> row[<span class="pl-s"><span class="pl-pds">&#39;</span>Gender<span class="pl-pds">&#39;</span></span>] <span class="pl-k">==</span> <span class="pl-s"><span class="pl-pds">&#39;</span>Male<span class="pl-pds">&#39;</span></span>:</td>
      </tr>
      <tr>
        <td id="L26" class="blob-num js-line-number" data-line-number="26"></td>
        <td id="LC26" class="blob-code blob-code-inner js-file-line">                pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>male<span class="pl-pds">&#39;</span></span>]<span class="pl-k">+=</span><span class="pl-c1">1</span></td>
      </tr>
      <tr>
        <td id="L27" class="blob-num js-line-number" data-line-number="27"></td>
        <td id="LC27" class="blob-code blob-code-inner js-file-line">            <span class="pl-k">else</span>:</td>
      </tr>
      <tr>
        <td id="L28" class="blob-num js-line-number" data-line-number="28"></td>
        <td id="LC28" class="blob-code blob-code-inner js-file-line">                pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>female<span class="pl-pds">&#39;</span></span>]<span class="pl-k">+=</span><span class="pl-c1">1</span></td>
      </tr>
      <tr>
        <td id="L29" class="blob-num js-line-number" data-line-number="29"></td>
        <td id="LC29" class="blob-code blob-code-inner js-file-line">                </td>
      </tr>
      <tr>
        <td id="L30" class="blob-num js-line-number" data-line-number="30"></td>
        <td id="LC30" class="blob-code blob-code-inner js-file-line">            contributions <span class="pl-k">=</span> <span class="pl-c1">float</span>(row[<span class="pl-s"><span class="pl-pds">&#39;</span>Total Contributions<span class="pl-pds">&#39;</span></span>].replace(<span class="pl-s"><span class="pl-pds">&#39;</span>,<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span><span class="pl-pds">&#39;</span></span>))</td>
      </tr>
      <tr>
        <td id="L31" class="blob-num js-line-number" data-line-number="31"></td>
        <td id="LC31" class="blob-code blob-code-inner js-file-line">            pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>totContributions<span class="pl-pds">&#39;</span></span>] <span class="pl-k">+=</span> contributions</td>
      </tr>
      <tr>
        <td id="L32" class="blob-num js-line-number" data-line-number="32"></td>
        <td id="LC32" class="blob-code blob-code-inner js-file-line">            </td>
      </tr>
      <tr>
        <td id="L33" class="blob-num js-line-number" data-line-number="33"></td>
        <td id="LC33" class="blob-code blob-code-inner js-file-line">            pop[age][<span class="pl-s"><span class="pl-pds">&#39;</span>totYears<span class="pl-pds">&#39;</span></span>]<span class="pl-k">+=</span><span class="pl-c1">float</span>(row[<span class="pl-s"><span class="pl-pds">&#39;</span>Years of Service<span class="pl-pds">&#39;</span></span>])</td>
      </tr>
      <tr>
        <td id="L34" class="blob-num js-line-number" data-line-number="34"></td>
        <td id="LC34" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L35" class="blob-num js-line-number" data-line-number="35"></td>
        <td id="LC35" class="blob-code blob-code-inner js-file-line"><span class="pl-c"># Generate a header</span></td>
      </tr>
      <tr>
        <td id="L36" class="blob-num js-line-number" data-line-number="36"></td>
        <td id="LC36" class="blob-code blob-code-inner js-file-line"><span class="pl-k">print</span> <span class="pl-s"><span class="pl-pds">&#39;</span>,<span class="pl-pds">&#39;</span></span>.join([<span class="pl-s"><span class="pl-pds">&#39;</span>Age<span class="pl-pds">&#39;</span></span>,<span class="pl-s"><span class="pl-pds">&#39;</span>Count<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span>Avg Contributions<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span>Avg Years of Service<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span>Pct Male<span class="pl-pds">&#39;</span></span>, <span class="pl-s"><span class="pl-pds">&#39;</span>Pct T1<span class="pl-pds">&#39;</span></span>])</td>
      </tr>
      <tr>
        <td id="L37" class="blob-num js-line-number" data-line-number="37"></td>
        <td id="LC37" class="blob-code blob-code-inner js-file-line"><span class="pl-k">for</span> i <span class="pl-k">in</span> <span class="pl-c1">range</span>(<span class="pl-c1">len</span>(pop)):</td>
      </tr>
      <tr>
        <td id="L38" class="blob-num js-line-number" data-line-number="38"></td>
        <td id="LC38" class="blob-code blob-code-inner js-file-line">    count <span class="pl-k">=</span> pop[i][<span class="pl-s"><span class="pl-pds">&#39;</span>count<span class="pl-pds">&#39;</span></span>]</td>
      </tr>
      <tr>
        <td id="L39" class="blob-num js-line-number" data-line-number="39"></td>
        <td id="LC39" class="blob-code blob-code-inner js-file-line">    avgContrib <span class="pl-k">=</span> <span class="pl-c1">0</span></td>
      </tr>
      <tr>
        <td id="L40" class="blob-num js-line-number" data-line-number="40"></td>
        <td id="LC40" class="blob-code blob-code-inner js-file-line">    pctMale <span class="pl-k">=</span> <span class="pl-c1">0</span></td>
      </tr>
      <tr>
        <td id="L41" class="blob-num js-line-number" data-line-number="41"></td>
        <td id="LC41" class="blob-code blob-code-inner js-file-line">    pctT1 <span class="pl-k">=</span> <span class="pl-c1">0</span></td>
      </tr>
      <tr>
        <td id="L42" class="blob-num js-line-number" data-line-number="42"></td>
        <td id="LC42" class="blob-code blob-code-inner js-file-line">    avgYears <span class="pl-k">=</span> <span class="pl-c1">0</span></td>
      </tr>
      <tr>
        <td id="L43" class="blob-num js-line-number" data-line-number="43"></td>
        <td id="LC43" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L44" class="blob-num js-line-number" data-line-number="44"></td>
        <td id="LC44" class="blob-code blob-code-inner js-file-line">    <span class="pl-c"># Compute averages</span></td>
      </tr>
      <tr>
        <td id="L45" class="blob-num js-line-number" data-line-number="45"></td>
        <td id="LC45" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">if</span> count <span class="pl-k">&gt;</span> <span class="pl-c1">0</span>:</td>
      </tr>
      <tr>
        <td id="L46" class="blob-num js-line-number" data-line-number="46"></td>
        <td id="LC46" class="blob-code blob-code-inner js-file-line">        avgContrib <span class="pl-k">=</span> pop[i][<span class="pl-s"><span class="pl-pds">&#39;</span>totContributions<span class="pl-pds">&#39;</span></span>] <span class="pl-k">/</span> <span class="pl-c1">float</span>(count)</td>
      </tr>
      <tr>
        <td id="L47" class="blob-num js-line-number" data-line-number="47"></td>
        <td id="LC47" class="blob-code blob-code-inner js-file-line">        pctMale <span class="pl-k">=</span> pop[i][<span class="pl-s"><span class="pl-pds">&#39;</span>male<span class="pl-pds">&#39;</span></span>] <span class="pl-k">/</span>  <span class="pl-c1">float</span>(count)</td>
      </tr>
      <tr>
        <td id="L48" class="blob-num js-line-number" data-line-number="48"></td>
        <td id="LC48" class="blob-code blob-code-inner js-file-line">        pctT1 <span class="pl-k">=</span> pop[i][<span class="pl-s"><span class="pl-pds">&#39;</span>t1<span class="pl-pds">&#39;</span></span>] <span class="pl-k">/</span> <span class="pl-c1">float</span>(count)</td>
      </tr>
      <tr>
        <td id="L49" class="blob-num js-line-number" data-line-number="49"></td>
        <td id="LC49" class="blob-code blob-code-inner js-file-line">        avgYears <span class="pl-k">=</span> pop[i][<span class="pl-s"><span class="pl-pds">&#39;</span>totYears<span class="pl-pds">&#39;</span></span>] <span class="pl-k">/</span> <span class="pl-c1">float</span>(count)</td>
      </tr>
      <tr>
        <td id="L50" class="blob-num js-line-number" data-line-number="50"></td>
        <td id="LC50" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L51" class="blob-num js-line-number" data-line-number="51"></td>
        <td id="LC51" class="blob-code blob-code-inner js-file-line">    rslt <span class="pl-k">=</span> [i, count, avgContrib, avgYears, pctMale, pctT1]     </td>
      </tr>
      <tr>
        <td id="L52" class="blob-num js-line-number" data-line-number="52"></td>
        <td id="LC52" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">print</span> <span class="pl-s"><span class="pl-pds">&#39;</span>,<span class="pl-pds">&#39;</span></span>.join(<span class="pl-c1">str</span>(x) <span class="pl-k">for</span> x <span class="pl-k">in</span> rslt)</td>
      </tr>
</table>

  </div>

</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
    <button type="submit" class="btn">Go</button>
</form></div>

        </div>
      </div>
      <div class="modal-backdrop"></div>
    </div>
  </div>


    </div>

      <div class="container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
        <li><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
      <li><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
      <li><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
        <li><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>
        <li><a href="https://github.com/pricing" data-ga-click="Footer, go to pricing, text:pricing">Pricing</a></li>

    </ul>

    <a href="https://github.com" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
</a>
    <ul class="site-footer-links">
      <li>&copy; 2015 <span title="0.07230s from github-fe120-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
        <li><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
        <li><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact</a></li>
        <li><a href="https://help.github.com" data-ga-click="Footer, go to help, text:help">Help</a></li>
    </ul>
  </div>
</div>



    
    
    

    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <button type="button" class="flash-close js-flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
        <span class="octicon octicon-x"></span>
      </button>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" integrity="sha256-+Ec97OckLaaiDVIxNjSIGzl1xSzrqh5sOBV8DyYYVpE=" src="https://assets-cdn.github.com/assets/frameworks-f8473dece7242da6a20d52313634881b3975c52cebaa1e6c38157c0f26185691.js"></script>
      <script async="async" crossorigin="anonymous" integrity="sha256-esNN/tNKE6bnHegtzlEV0CPX20i/upGyJQ/AOAPEt7Y=" src="https://assets-cdn.github.com/assets/github-7ac34dfed34a13a6e71de82dce5115d023d7db48bfba91b2250fc03803c4b7b6.js"></script>
      
      
    <div class="js-stale-session-flash stale-session-flash flash flash-warn flash-banner hidden">
      <span class="octicon octicon-alert"></span>
      <span class="signed-in-tab-flash">You signed in with another tab or window. <a href="">Reload</a> to refresh your session.</span>
      <span class="signed-out-tab-flash">You signed out in another tab or window. <a href="">Reload</a> to refresh your session.</span>
    </div>
  </body>
</html>

>>>>>>> 28ae493096a74d65c5e7b9c2d3e6fe10b0da7953
>>>>>>> 526ce7dfdd65d41e98865bc72dfde003697a8123
