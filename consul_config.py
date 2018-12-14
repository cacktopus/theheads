import platform


class ConsulConfig:
    def __init__(self, *args):
        self._params = {}

    async def setup(self):
        hostname = platform.node()
        self._params['hostname'] = hostname
        self._params['installation'] = await self.get_config_str(
            "/the-heads/machines/{hostname}/installation"
        )
        return self
