<template>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link to="/" class="navbar-brand">Home</router-link>
        </div>

        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <router-link to="/collections" activeClass="active" tag="li"><a>Collections</a></router-link>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Link</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>
