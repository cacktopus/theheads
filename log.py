import logging
import traceback

from pythonjsonlogger import jsonlogger


def _setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    logHandler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter()
    logHandler.setFormatter(formatter)

    logger.addHandler(logHandler)

    print(len(logger.handlers))

    return logger


_logger = _setup_logging()


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
    tb = traceback.format_exc()
    extra = {"level": "CRITICAL", "traceback": tb}
    extra.update(extra_fields)
    _logger.info(message, extra=extra)
