import logging

from pythonjsonlogger import jsonlogger


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    logHandler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter()
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)

    return logger


_logger = setup_logging()


def debug(message, **extra_fields):
    extra = {"level": "INFO"}
    extra.update(extra_fields)
    _logger.debug(message, extra=extra)


def info(message, **extra_fields):
    extra = {"level": "INFO"}
    extra.update(extra_fields)
    _logger.info(message, extra=extra)


def error(message, **extra_fields):
    extra = {"level": "ERROR"}
    extra.update(extra_fields)
    _logger.info(message, extra=extra)


def critical(message, **extra_fields):
    extra = {"level": "CRITICAL"}
    extra.update(extra_fields)
    _logger.info(message, extra=extra)
