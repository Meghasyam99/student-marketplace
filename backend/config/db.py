"""Database helpers.

Keeps MySQL (PyMySQL) wiring in one place.
"""

import pymysql


def install_as_mysqlclient():
    """Make PyMySQL act as MySQLdb for Django."""

    pymysql.install_as_MySQLdb()
